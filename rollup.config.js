import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";
import replace from "rollup-plugin-replace";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

console.log("building");

const config = {
  input: "index.js",
  output: {
    name: "ReactRenderHare",
    globals: {
      react: "React"
    }
  },
  external: ["react"],
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    resolve(),
    commonjs({
      include: /node_modules/
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    })
  ]
};

if (process.env.NODE_ENV === "production") {
  config.plugins.push(uglify());
}

export default config;
