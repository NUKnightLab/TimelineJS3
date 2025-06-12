The TimelineJS website
----------------------
The content of the TimelineJS website is generated from the `website` directory in the repository. The website is built using `eleventy`, a static site generator.

To build the website, you need to have `node.js` and `npm` installed. Once you have those, you can run the following commands in the `website` directory:
```bash
npm install
npm run start
```

This will install the necessary dependencies and start a local development server. You can then view the website at `http://localhost:8080`

When working on the website locally, the server will load the most recently built version of TimelineJS from the `dist` directory. If you've never built TimelineJS before, the authoring tool may not work as expected. If this comes up, run the following command in **the root directory** of the repository:
```bash
npm run build
```
This will build the TimelineJS library and place the output in the `dist` directory, which the website will then use.
