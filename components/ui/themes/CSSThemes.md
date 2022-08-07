# CSS Themes

We can customize the application by adding a new file under components/ui/themes and import that file in components/ui/styleUtils.ts and assign that file to Theme variable

```
components/ui/styleUtils.ts

eg:-
import { PurpleTheme } from './PurpleTheme';

export const Theme = PurpleTheme;
```

## **Logo and Background Images :**

To change the mosip logo

```
MosipLogo = require(path of logo you want to use, in string format)

*logo can be png or svg

eg:-
MosipLogo = require('../../assets/mosip-logo.png')
```

To change the profile logo which is available as a demo while loading the vc details

```
ProfileIcon = require(path of logo you want to use, in string format)

*logo can be png or svg

eg:-
ProfileIcon: require('../../assets/placeholder-photo.png')
```

To change the close card details background

```
CloseCard = require(path of image you want to use, in string format)

*Image can be png or svg
-width: 363 pixels
-height: 236 pixels

eg:-
CloseCard: require('../../assets/ID-closed.png')
```

To change the OpenCard card details background

```
OpenCard = require(path of image you want to use, in string format)

*Image can be png or svg
-width: 363 pixels
-height: 623 pixels

eg:-
  OpenCard: require('../../assets/ID-open.png')
```

## **Colors :**

To change the color of
