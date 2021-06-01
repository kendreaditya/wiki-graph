<p align="center"><img src="src\assets\logo.svg" width="175" title="Wiki Graph Logo"><h1></h1></p>

<p align="center">
Wiki Graph is a graph-based interface for reseraching articles and finding realted topics. <a href="https://kendreaditya.github.io/wiki-graph/">Try it here!</a>
</p>

# 📝 Table of Contents

- [Architecture](#architecture)
- [Work to be done](#todo)
- [Usage](#usage)
- [Contributing](#contributing)

# 🏗️ Architecture

- Rect.js
  - Fast component/UI updates
  - Uni-direcitonal data binding
- react-vis-force
  - Uses d4-style components approach with the d3-force library
  - Declaratively provide links and nodes as for rendering.
- Fetch
  - Native & Promises

# 💡 Work to be done
- Fix depth lag
- Add size based on connections 
- Add color based on root node
- Add updated poping animation based on rendering graph
- Add ability to add and remove nodes -> search list materail ui list
- Add ability to click on on node an take to wiki page
- Add ability to preview wikipage when hovering
- Add ability to change different topic
- Render as more responces come in -> dont' think thats possible
- Add ML agorhtims for sorting via sentamet/attention/relativeness

# ✍️ Usage

### `npm start`

Runs the app in the development mode.
Open to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

# 🤗 Contributing

Feel free to contribute by making a pull request.
The MIT License (MIT)
