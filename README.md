# ReaderZone WebApp

## Setup

- create `.env` file and copy content from `.env.example` file and change values accordingly

- run `npm install`

- For development purpose, run `npm start`

- For peoduction build, run `npm run build` which will create dist folder

## CSS Modules References

---

- https://glenmaddern.com/articles/css-modules

- https://github.com/css-modules/css-modules

## Coding styleguide

---

### common

- Follow eslint rule

- Try to use inline style as less as possible

### SCSS

- All components should have its own scss file so that global scope will not get polluted

- If we want to reference other scss file, then user something like `@import "~src/styles/common.scss";`, here `~` will be handled by [sass-loader#imports](https://github.com/webpack-contrib/sass-loader#imports)

### Routing url

1. All routing url should be defined in `src/helpers/urls.js`, For e.g.,
2. When we define route in `src/screens/index.js` , it should use url from urls.js like `path={URL.LOGIN()}` instead of direct `path={"/login"}`.
3. Whenever we want to navigate to any screen, it should use url from urls.js like `history.push(URL.LOGIN())` instead of direct `history.push("/login")`.
4. Example 1
   suppose we want to define login url
   - in urls.js : `LOGIN: abstractURL('/login')`,
   - in `src/screens/index.js` : `path={URL.LOGIN()}`
   - when we want to navigate : `history.push(URL.LOGIN())`
5. Example 2
   suppose we want to define some item url with one parameter
   - in urls.js : `ITEM: abstractURL('/items/:id')`,
   - in `src/screens/index.js` : `path={URL.ITEM()}` , here `URL.ITEM()` will return path regex i.e. `/items/:id`
   - when we want to navigate : `history.push(URL.ITEM({id: 1}))`, here `URL.ITEM({id: 1})` will return actual path url i.e. `/items/1`

### Component & themr

- Every component should use themr hoc & `propTypes`
- themr gives a way to create fully customizable component regarding styles
- check `Button` component for sample example
- `themr` gives `classes` and `theme` props to Original component
- `themr` will accept 2 argument, component identifier and default styles for component
- How to use
  - Suppose we have Button component, and styles.scss file for that component , which contains `.button` classname
  - now we will use `themr` like this `themr('Button', styles)(Button)`
  - now when we use Button component in other screens/component and if we want to customize style of that component , we will pass `classes` props to button, `classes` will be object of css modules
  - for e.g. `<Button classes={<custom styles>} {...other props}>` 

### Theming
- Themes are defined in 2 formats.
  - JS format (src/styles/theme.js)
  - css format
- Whenever we use `themr` hoc, we get `theme` object of particular theme in `props`
- Semantic theme guideline (coming soon)
- Whenever we update js theme , we should update scss theme, vice versa