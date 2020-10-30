# TaskTrak
Simple task tracker android and IOS app.

I started this out just to learn react native, but this app actually became useful to me.
Who could have guessed that an annoying constant remainder of things that I am yet to
do would acutally prove itself so useful.

As you can see, there are two types of task, the ones we do frequently and the ones we
only do once. These two can be tracked in the app.

Forewarning: If you have any tasks not done, this app will spam your notifications
constatly about it.

The design is dead simple (and ugly!), take a look:

Frequent tasks:

![image](https://i.imgur.com/uhB6RnR.png)

One shot tasks:

![image](https://i.imgur.com/YIpsjQY.png)

Input interface:

![image](https://i.imgur.com/7Ljh1pe.png)

#### Running

In one terminal type
```
npx react-native start
```

In another terminal type:

If you want the dev environment
```
npx react-native run-android
```

If you want production environment
```
npx react-native run-android --variant=release
```

If you want to run it on your android device: [follow this](https://reactnative.dev/docs/running-on-device)

#### Testing


```
yarn run test
```
