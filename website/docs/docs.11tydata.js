export default {
	permalink: function (data) {
		// Keep "index" as "index.html" instead of transforming it to "docs.html"
		if (data.page.filePathStem === '/docs/index') {
			return `/docs/index.html`;
		}
		return `/docs/${this.slugify(data.page.fileSlug)}.html`;
	},
};