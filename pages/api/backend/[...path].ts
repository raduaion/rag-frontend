import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';

export const config = {
  api: {
    bodyParser: false,
  },
};

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path, ...queryParams } = req.query; // Exclude `path` from query params
  const backendPath = Array.isArray(path) ? path.join('/') : path || '';
  const queryString = querystring.stringify(queryParams); // Construct query string without `path`

  // Construct the full backend URL, including query parameters
  const backendUrl = `${API_ENDPOINT}/${backendPath}${
    queryString ? `?${queryString}` : ''
  }`;

  console.log('\n\nProxying to backend URL:', backendUrl);

  const excludedHeaders = new Set([
    "connection", "sec-fetch-dest", "sec-fetch-mode", "sec-fetch-site",
    "x-forwarded-proto", "x-forwarded-host", "x-forwarded-port",
    // "accept-encoding" // Optional: Backend might not support compression
  ]);

  const normalizedHeaders: Record<string, string> = {};
  Object.entries(req.headers).forEach(([key, value]) => {
    if (!excludedHeaders.has(key.toLowerCase())) {
      normalizedHeaders[key] = Array.isArray(value) ? value.join(",") : value || "";
    }
  });

  console.log('Normalized Headers:', normalizedHeaders);

  try {
    // Handle Request Body Properly to Avoid Content-Length Mismatch
    let body: BodyInit | null = null;

    if (req.method !== "GET" && req.method !== "HEAD") {
      // Use req.body if it's available (Next.js automatically parses JSON requests)
      if (req.body && typeof req.body === "object") {
        body = JSON.stringify(req.body);
      } else {
        // Convert request body into a readable stream only when necessary
        body = await new Promise<Buffer | null>((resolve, reject) => {
          const chunks: Buffer[] = [];
          const timeout = setTimeout(() => {
            reject(new Error("Request body reading timeout")); // Prevent infinite loops
          }, 5000);

          req.on("data", (chunk) => chunks.push(chunk));
          req.on("end", () => {
            clearTimeout(timeout);
            resolve(chunks.length ? Buffer.concat(chunks) : null);
          });
          req.on("error", (err) => {
            clearTimeout(timeout);
            reject(err);
          });
        });
      }
    }

    // console.log('Request Body:', body);

    // Forward the request to the backend
    const backendResponse = await fetch(backendUrl, {
      method: req.method,
      headers: {
        ...normalizedHeaders,
        cookie: req.headers.cookie || '', // Explicitly forward cookies
      },
      body,
      redirect: 'manual', // Handle redirects manually
      credentials: 'include',
    });

    // Copy backend response headers and status code
    res.status(backendResponse.status);
    backendResponse.headers.forEach((value, key) => {
      if (key !== 'transfer-encoding') {
        res.setHeader(key, value);
      }
    });

    const setCookie = backendResponse.headers.get('set-cookie');
    // console.log("Set-Cookie:", setCookie);
    if (setCookie) {
      res.setHeader('Set-Cookie', setCookie);
    }

    // Handle redirects
    if (backendResponse.status >= 300 && backendResponse.status < 400) {
      const location = backendResponse.headers.get('location');
      if (location) {
        // Redirect the client to the new location
        res.setHeader('Location', location);
        res.end();
        return;
      }
    }

    const contentType = backendResponse.headers.get("Content-Type") || "";

    if (contentType.includes("text/event-stream")) {
      //Enable real-time streaming
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Flush headers immediately
      res.flushHeaders();

      const reader = backendResponse.body?.getReader();
      const encoder = new TextEncoder();
      const decoder = new TextDecoder("utf-8", { fatal: false });
      const writer = res;

      // console.log("Streaming started...");
      let buffer = "";

      async function streamResponse() {
        try {
          while (true) {
            if (!reader) {
              console.error("No reader available");
              res.status(500).json({ error: "No response body from backend" });
              return;
            }

            const { done, value } = await reader.read();
            if (done) {
              reader.cancel();
              res.end();
              break;
            }

            if (!value) continue; // Ensure value is valid before decoding
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk; // Append to buffer

            // Ensure only complete JSON lines are processed
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // Keep incomplete lines in buffer

            lines.forEach((line) => {
              if (!line.startsWith("data:")) return;

              const jsonString = line.replace("data:", "").trim();
              if (!jsonString) return;

              // console.log(`Sending: 'data: ${jsonString}\n\n'`);

              try {
                writer.write(encoder.encode(`data: ${jsonString}\n\n`)); // Stream data immediately
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (writer as any).flush?.();
                // writer.flush?.(); // Ensure immediate transmission
              } catch (error) {
                console.error("Error writing chunk:", error);
              }
            });
          }
        } catch (err) {
          console.error("Streaming error:", err);
          if (!res.headersSent) {
            res.status(500).json({ error: "Error while streaming response" });
          }
        } finally {
          // console.log("Closing response stream...");
          if (!res.headersSent) {
            res.end(); // Properly close response
          }
        }
      }

      // Await the streamResponse function to ensure Next.js waits for the response
      await streamResponse();
      return;
    }

    // Stream the backend response to the client
    const responseBody = await backendResponse.text();
    res.setHeader("Content-Type", contentType);
    res.send(responseBody);
  } catch (error) {
    console.error("Error proxying request:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
