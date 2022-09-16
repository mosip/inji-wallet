# CSS Themes

We can customize the application Theme by adding a new file under components/ui/themes and import that file in components/ui/styleUtils.ts and assign that file to Theme variable

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

To change the color of TabItemText

![Image](../../../assets/img3.png 'Image')

```
export const DefaultTheme = {
  Colors: {
    TabItemText: colors.Orange,
    ...
  }
}
```

To change the color of Details Label Text

![Image](../../../assets/img1.png 'Image')

```
export const DefaultTheme = {
  Colors: {
      DetailsLabel: colors.Orange,
    ...
  }
}
```

To change the color of Details Text

![Image](../../../assets/img1.png 'Image')

```
export const DefaultTheme = {
  Colors: {
      Details: colors.Orange,
    ...
  }
}
```

To change the color of AddId Button Text and Background

![Image](../../../assets/img4.png 'Image')

```
export const DefaultTheme = {
  Colors: {
     AddIdBtnBg: colors.Orange,
      AddIdBtnTxt: colors.Orange,
    ...
  }
}
```

To change the color of Icons

![Image](../../../assets/img6.png 'Image')

```
export const DefaultTheme = {
  Colors: {
      Icon: colors.Orange,
    ...
  }
}
```

To change the Background Color of Icons

![Image](../../../assets/img7.png 'Image')

```
export const DefaultTheme = {
  Colors: {
       IconBg: colors.Orange,
    ...
  }
}
```

To change the Color of Loading Transition

![Image](../../../assets/img8.png 'Image')

```
export const DefaultTheme = {
  Colors: {
       Loading: colors.Orange,
    ...
  }
}
```

To change the Color of noUinText

![Image](../../../assets/img9.png 'Image')

```
export const DefaultTheme = {
  Colors: {
       noUinText: colors.Orange,
    ...
  }
}
```

To change the Color of profileLabel

![Image](../../../assets/img10.png 'Image')

```
export const DefaultTheme = {
  Colors: {
       profileLabel: colors.Black,
    ...
  }
}
```

To change the Color of profileValue and profileAuthFactorUnlock

![Image](../../../assets/img11.png 'Image')

```
export const DefaultTheme = {
  Colors: {
    profileAuthFactorUnlock: colors.Grey,
    profileValue: colors.Grey,
    ...
  }
}
```

To change the Color of profileVersion

![Image](../../../assets/img12.png 'Image')

```
export const DefaultTheme = {
  Colors: {
       profileVersion: colors.Grey,
    ...
  }
}
```
