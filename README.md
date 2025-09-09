# checkBox.js 

This is a javascript plugin for handling custom checkboxes.

### Integrations 
This [plugin](https://teymzz.github.io/checkBox) is integrated to work with the _[selectorJs](https://github.com/teymzz/selector)_ plugin which is used for selecting items. Without the _selectorJs_ query selector plugin, it will still be able to run efficiently with all supported basic javascript query selectors. However, the element selection range may be limited. 

### Installation
Download the javascript plugin and add into the head or footer of your project application 

```html
<script src="checkbox/checkBox.js">
```

You can also use the cdn link below in your html script tag

```html
https://cdn.jsdelivr.net/gh/teymzz/checkBox/checkBox.js
```

### Html Structure

In order to use this plugin, the html structure of the custom checkbox should resemble the format below in which the custom selector identified by the default ```[checkbox]``` selector comes immediately before the input checkbox html element as shown below: 

```html 
<div>
    <div checkbox=""></div>
    <input type="checkbox">
</div>
```

> The checkbox assumes the format that an element with attribute _checkbox_ must preceed an input element of type _checkbox_. This structure will ensure that all default checkboxes are automatically hidden immediately the page is loaded and the plugin initialized.

### Designing CheckBox

Using css, we can design our custom checkbox by setting a default size for the checkbox by targetting the ```checkbox``` attribute selector as shown below:

```css
[checkbox] {
    width: 20px;
    height: 20px;
}
```

> We can also add more designs like ```border-radius``` to the custom box 

```css
[checkbox] {
    width: 20px;
    height: 20px;
    border-radius: 100vh;
}
```

### Initialize Plugin

After the plugin has been added to the project file, we can initialize this plugin as shown below 

```js 
let checkBox = new CheckBox; //initialize and start execution
```

We can also use the method below to intialize the plugin 

```js
let checkBox =  new CheckBox(false) //delay execution
checkBox.check() //start execution.
```

> Once the plugin is initialized, all html elements having the custom _checkbox_ html format will automatically hide the default checkboxes that immediately follows them.

### Handling Check Events

Check events occur when we either check or uncheck a checkbox. The _checkbox.js_ plugin handles this event using the _toggle_ key which takes a callback function that is called when a check event occur.

```js 
new CheckBox({
    toggle: function(checkBox){
        if(checkBox.checked){
            console.log('checkbox is checked')
        }else{
            console.log('checkbox is unchecked')
        }
    }
})
```

> The toggle callback will execute once the checkbox is clicked. The supplied callback argument _checkBox_ is an object that returns the information about the 
selected items. The properties returned by this object include the _custom_, _native_, _marker_, _checked_, _value_ and _init_ methods. 

 + ```target```   : This refers to the relatively selected custom box or target element
 + ```native```   : This refers to the original (or native) html input checkbox element
 + ```marker```   : When a custom checkbox element has a child element used as indicator item, the marker property is used to target that child indicator element within the custom checkbox. 
 + ```checked```  : This returns true when a native checkbox is checked
 + ```disabled``` : This returns true when a native checkbox is disabled
 + ```value```    : This returns the relative value of a native checkbox element
 + ```init```     : This returns the default function that is called immediately the plugin is loaded. 

### Examples of Plugin Usage

Assuming we have a default css sample as shown below: 

```html 
<style>
[checkbox] {
    display:inline-block;
    padding: 4px;
    background-color: white;
}

.box {
    width: 20px;
    height: 20px;
}

.bc-green {
    background-color: green;
}
</style>
```

There are different ways by which the plugin can be utilized. Some samples are shown below 

   #### #Example 1 (Basic Usage)

   The sample html structure below is a simple application of the checkbox plugin 

   ```html 
   <div>
       <div class="box" checkbox></div>
       <input type="checkbox">
   </div>
   ```   
   
   > By default, checkbox selectors are identified by the attribute of _[checkbox]_. The plugin takes advantage of this and provides us with the ```.custom``` property which targets the custom checkbox element. We can then change the background color of the checkbox easily by adding or removing the ```".bc-green"``` class when it is checked or unchecked. This is shown below: 

   ```js 
   new CheckBox({
       toggle: function(checkBox){
           if(checkBox.checked){
               checkBox.custom.classList.add('bc-green')
           }else{
               checkBox.custom.classList.remove('bc-green')
           }
       }
   })
   ```

   #### #Example 2 (Single Markers)

   The sample checkbox structure below employs the use of a single marker that is expected to be an indicator. Notice that the _.box_ selector which sets the size and width of the checkbox was shifted to the marker. This is not always required if the marker has its own custom size.

   ```html 
   <div>
       <div checkbox>
          <div class="box" marker></div>
       </div>
       <input type="checkbox">
   </div>
   ```   

   > By default, checkbox markers are identified by the attribute of ```[markers]``` and they must exist within the ```[checkbox]``` elements. The plugin takes advantage of this and provides us with the _marker_ property which targets the marker of the custom checkbox element. We can then change the background color of the marker easily by adding or removing the ".bc-green" class when it is checked or unchecked. This is shown below: 

   ```js 
   new CheckBox({
       toggle: function(checkBox){
           if(checkBox.checked){
               checkBox.marker[0].classList.add('bc-green')
           }else{
               checkBox.marker[0].classList.remove('bc-green')
           }
       }
   })
   ```

   #### #Example 3 (Double Markers)

   Double markers exists in situation where we need to create two custom indicators for when an item is checked and when it is unchecked. This is mostly useful when we have custom images that can be applied when an item is checked or when it is unchecked. In this example, we have a different css format below: 

   ```html 
   <style>
   [checkbox] {
       display:inline-block;
       padding: 4px;
       background-color: white;
   }
   
   [checkbox] > [marker] {
       width: 20px;
       height: 20px;
   }
   
   [checkbox="checked"] [marker]:nth-child(1) {
       display: none;
   }
   
   [checkbox]:not([checkbox="checked"]) [marker]:nth-child(2) {
       display: none;
   }

   .bc-red {
     background-color: red;
   }

   .bc-green {
     background-color: green;
   }
   </style>
   ```   

   > Whenever a custom checkbox is checked, a value of ```"checked"``` is usually assigned to this attribute. Taking advantage of this, the css above defines that the first marker should only be displayed when the checkbox attribute has an value of ```"checked"``` while the second marker should only be displayed when the checkbox does not have a value that is equivalent to ```"checked"```. This css format will result to creating a custom toggle effect. The html structure is shown below:

   ```html 
   <div>
       <div checkbox>
          <div class="bc-red" marker></div>
          <div class="bc-green" marker></div>
       </div>
       <input type="checkbox">
   </div>
   ```   

   > Since the default css has been added, all we need to do is to initialize our custom checkbox plugin which will automatically create the toggle effect.

   ```js 
   new CheckBox()
   ```

### Auto Flipping Markers

Markers are usually custom check boxes that indicate when an item is checked or unchecked. The plugin supports a maximum of two markers in which one can be for when the checkbox is checked and the other is for when the checkbox is unchecked. Taking advantage of this, when two markers are defined, and a _flip_ key is set as ```true```, an automatic toggle event will be added for the two markers in which the first marker will be used as default (unchecked) while the second marker will be the alternative that will be displayed when the checkbox is checked. The html structure will resemble the format below:

```html 
<style>
[checkbox] [marker] {
    width: 20px;
    height: 20px;
}

.bc-red {
    background-color: red;
}

.bc-green {
    background-color: green;
}
</style>
```

```html 
<div>
    <div checkbox>
        <div class="bc-red" marker></div>
        <div class="bc-green" marker></div>
    </div>
    <input type="checkbox">
</div>
```

> Once we have defined the structure, we can head on to create the script just as shown below

```js 
new CheckBox({
    flip: true
})
```

> In the code above, just by setting the _flip_ key to ```true```, the markers will automatically be toggled based on whether the default checkbox is checked or unchecked. This is by far the easiest way to handle custom toggles.

### Custom Selectors

Both the checkbox selector and the marker selector are defaulted as ```[checkbox]``` and ```[marker]``` respectively. However, we can define a custom selector when initializing the class by using the _target_ key for the selector and using the _marker_ to define the marker as shown below

```js 
new CheckBox({
    target: '[checkbox]', //custom selector
    marker: '[marker]', //custom marker
    toggle: function(checkBox){
        //callback function
    }
})
```

### Eager Loading Check Events

Although, by default, the custom boxes try to imitate their relative checkboxes yet no real click event is triggered. In situations where we need to trigger an event immediately a page is loaded based on the status of the checkboxes this may be difficult to achieve. An example is shown below:

```js 
new CheckBox({
    toggle: function(checkbox){
        if(checkbox.checked) {
            console.log('checkbox is checked!')
        } else {
            console.log('checkbox unchecked!')
        }
    }
})
```

> In the sample above, the toggle callback function will only run after the element has been clicked at least once. However, in situations where we need this function to run early, we need to use the init key to set an eager function using the _init_ option as shown below: 

```js 
new CheckBox({
    init: function(checkbox) {
        if(checkbox.checked) {
            console.log('checkbox is checked!')
        } else {
            console.log('checkbox unchecked!')
        }
    },
    toggle: function(checkbox){
        if(checkbox.checked) {
            console.log('checkbox is checked!')
        } else {
            console.log('checkbox unchecked!')
        }
    }
})
```

> In the code above, the ```init``` method will first run immediately the page is loaded. However, the code seems to be long because there is a bit of repetition. We can shorten this in the toggle method by taking advantage of the argument that gives an access to the ```init``` method. This code can be improved as shown below: 

```js 
new CheckBox({
    init: function(checkbox) {
        if(checkbox.checked) {
            console.log('checkbox is checked!')
        } else {
            console.log('checkbox unchecked!')
        }
    },
    toggle: function(checkbox){
        checkbox.init(checkbox)
    }
})
```

> Since the argument supplied into the toggle has access to the ```init``` method, in the code above, we took advantage of this to call the ```init``` method within the toggle method, making it easier to re-run the initial function within the toggle without having to redefine it. This keeps our code easier to read and maintain. It also reduces the number of lines of code we need to write and reduces the chances of making errors.

### Animating Markers 

The checkbox plugin supports custom css animations. In order to add some special effect into our checkboxes we can use the [animate.css](https://animate.style) library. This library makes use of some special classes that can be added when a toggle event is made. For example using the ```animate__bounceIn``` class effect from the css animation library we can have an html structure as shown below.

```html 
<div>
    <div checkbox>
        <div class="bc-red animation" marker></div>
        <div class="bc-green animation" marker></div>
    </div>
    <input type="checkbox">
</div>
```

> The javascript code can resemble the format below:

```js
new CheckBox({
    toggle: function(checkbox) {
        if(checkbox.checked){
            checkbox.marker[1].classList.add('animate__animated', 'animate__bounceIn');
        }else{
            checkbox.marker[1].classList.remove('animate__animated', 'animate__bounceIn');
        }
    },
    flip: true,
})
```

> In the code above, the css class ```animate__bounceIn``` is added to the first marker only when the checkbox is checked. We are not using the _init_ function here because we don't want to start the animation immediately the page loads but only after the checkbox is clicked.

### Setting Markers sizes 

Although the css can be used to set marker's sizes, the plugin can also help to set a default marker size when we initialize the plugin. The defined size will however be used for both the width and the height of the custom checkbox.

```html 
<div>
    <div checkbox>
        <div class="bc-red" marker></div>
        <div class="bc-green" marker></div>
    </div>
    <input type="checkbox">
</div>
```

> The javascript code can resemble the format below:

```js
new CheckBox({
    toggle: function(checkbox) {
        if(checkbox.checked){
            checkbox.marker[1].classList.add('animate__animated', 'animate__bounceIn');
        }else{
            checkbox.marker[1].classList.remove('animate__animated','animate__bounceIn');
        }
    },
    flip: true,
    size: '20px'
})
```

> In the code above, the "size" option is used to add a defualt size to the custom markers. This sizes will be applied on all the markers.

### Other features 
There are couple of other features supported by this plugin. The tutorial documentation 
is available at [spoova packages](https://spoova.checkboxjs.com) along with detailed examples of how custom checkboxes can be applied.

### Suggestions 
For an easier way to select items, we suggest to download the [selector.js](https://github.com/teymzz/selector.js) plugin which helps to improve the query selection capacity of this plugin if a custom query selector is required.