---
description: Deploy the application to Vercel
---

# Deploy to Vercel

This workflow guides you through deploying your Next.js application to Vercel.

1.  **Verify Build Integrity**
    Ensure your application builds correctly locally before deploying.
    ```bash
    npm run build
    ```

2.  **Deploy using Vercel CLI**
    Use `npx` to run the Vercel CLI without installing it globally. This will prompt you to log in and configure the project if it's your first time.
    ```bash
    npx vercel
    ```
    -   **Log in**: Follow the browser prompt to authenticate.
    -   **Project Setup**: Accept default settings mainly (Project name: `iran-news-now`, Root directory: `./`).
    -   **Override settings**: You usually don't need to override build settings for Next.js.

3.  **Deploy to Production**
    By default, `vercel` deploys to a preview environment. To deploy to production:
    ```bash
    npx vercel --prod
    ```

## Alternative: Git Integration (Recommended)
For continuous deployment:
1.  Push your code to a GitHub repository.
2.  Go to the [Vercel Dashboard](https://vercel.com/dashboard).
3.  Click **Add New...** > **Project**.
4.  Import your GitHub repository.
5.  Vercel will automatically deploy every time you push to `main`.
