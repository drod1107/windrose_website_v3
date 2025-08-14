import withMDX from "@next/mdx";
import remarkGfm from "remark-gfm";

const withMdx = withMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
  },
});

const nextConfig = {
  compiler: {
    emotion: true,
  },
  pageExtensions: ["ts", "tsx", "mdx"],
};

export default withMdx(nextConfig);
