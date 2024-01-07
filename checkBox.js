class CheckBox {

    constructor(config) {

        let checkbox = this;

        checkbox.hardchecks = [];

        if(config === true) return checkbox;
        
        let defaults, customBoxes, init, toggle, assign, css, size, fsize, fit, checkEvent;

        defaults = {
            target: '[checkbox]',
            marker: '[marker]',
            assign:  {
                attr: [],
                alter: () => {}
            },
            group: {

            },
            init:   function(){},
            toggle: function(){},
            flip: false,
            size: null,
            fit: true
        };

        config = {...defaults, ...config};

        checkbox.target = config.target;
        checkbox.marker = config.marker;
        checkbox.flip = config.flip;
        checkbox.fit = config.fit;

        init = config.init;
        toggle = config.toggle;
        assign = config.assign;
        size = config.size;
        fsize = config.fsize;
        fit = config.fit;
        css = false;

        if(typeof Selector === 'function'){
            let selector = new Selector;
            customBoxes = selector.select(checkbox.target);
        }else{
            customBoxes = document.querySelectorAll(checkbox.target)
        }

        // DEFINED HELPER FUNCTIONS

        function stringSplit(string, separator = '|'){
            let item = {};
            string = string || '';
            let splitItem = string.split(separator);

            splitItem.forEach((split, index) => {
                item[index] = split;
            })

            return item;
        }
        
        /**
         * Resolves the width and height of custom box
         * @param {string|object} size 
         * @returns object
         */
        function getSize(size){
            let width, height;
            size = size || '';

            if(typeof size === 'object'){
                width = size.width || size.x || '';
                height = size.height || size.y || width;
            }else{
                size = stringSplit(size);
                width = size[0] || '';
                height = size[1] || width;
            }
            return {x:width, y:height};
        }

        // get attribute from an element (match with value if supplied)
        function at(element, attr){

           attr = element.getAttribute(attr)

           return {
            value: (returnType = '') => {
                if(arguments.length > 0){
                    return attr || returnType;
                }
                return attr;
            },
            is: (value) => {
                return attr === value;
            },
            not: (value) => {
                if(Array.isArray(value)){
                    let ret = true;
                    value.forEach(val => {
                        if(attr === val){
                            ret = false;
                            return false;
                        }
                    })
                    return ret;
                }else{
                    return attr !== value;
                }
            },
            has: (value, separator = ' ') => {
                if(!typeof attr === 'string') return false;
                attr = attr.split(separator);
                return attr.includes(value);
            },
            hasAttr: (attribute) => {
                attribute = attribute || attr;
                if(!attribute) return false;
                if(element.getAttribute(attribute) !== null){
                    return true;
                }
                return false;
            },
            /**
             * 
             * @param {string} separator 
             * @param {string} returnType options [array|string]
             * @returns {*}
             */
            attrvals: (separator = ' ', returnType = 'array') => {
                if(typeof attr !== 'string'){
                    if(returnType === 'string') return ''; 
                    if(returnType === 'array') return []; 
                    return attr; //value of attribute
                }
                if(returnType !== 'array') return attr;
                return attr = attr.split(separator).filter((str) => str !== "");
            },
            checked: () => {
                return (isCheckbox(element) && element.checked);
            },
            click: () => {
                 //if(isCheckbox(element)){
                    element.click();
                 //}
            }
           };
        }

        /* detect if element is checkbox */
        function isCheckbox(element){

            return ((element.tagName === 'INPUT')
            && (element.getAttribute('type') === 'checkbox'))? element : false;

        }

        /* detect if element is checked */
        function hasChecked(element){
            return (isCheckbox(element) && element.checked);
        }

        let animeAttr;

        if(typeof assign === 'object' && Array.isArray(assign.attr)){

            /**
             * Add attribute toggle support
             * @param {object} box custom box
             * @param {boolean} checked checkbox status 
             * @param {string} assignAnime data-assign value 
             * @param {array} markers 
             */        
            animeAttr = (box, checked, assignAnime, markers) => {

                // set default assign configuration
                let iniAssign  = assign.attr;
                let dataAssign = iniAssign;

                if(assignAnime){

                    // format local data-assign attribute

                    dataAssign = [];

                    //split handle string value
                    let attrSplit = assignAnime.split('|');
                    if((attrSplit.length === 1) && (iniAssign.length > 1)){
                        // assign [source, destination, <data-assign>]
                        // data-assign: status
                        assignAnime = attrSplit[0];    
                        dataAssign[0] = iniAssign[0];  
                        dataAssign[1] = iniAssign[1];   
                        dataAssign[2] = assignAnime;  
                    }else if(attrSplit.length > 2){
                        // assign [<data-assign[0]>,<data-assign[1]>]
                        // data-assign [status, source, destination]
                        assignAnime = attrSplit[0];    
                        dataAssign[0] = attrSplit[1];  
                        dataAssign[1] = attrSplit[2];
                        dataAssign[2] = assignAnime;
                    }

                }

                let attrs = dataAssign;

                if(attrs.length > 1){
                    //when three argument supplied source, dest, type
                    let sourceAttr = attrs[0]; //source attribute
                    let destAttr = attrs[1]; //destination attribute
                    let animated = 'checked';
                    let animate  = false;
                    let animator = assignAnime || attrs[2];
                    let animateMarker = false;
                    markers = markers || []
                    if(attrs.length > 2){
                        let animations = ['checked','unchecked','both','false',':markers',':marker1',':marker2'];
                        if(animations.includes(animator)){
                            animated = animator
                        }else{
                            console.error('unknown attribute animation type "'+animator+'" assigned to checkbox')
                        }
                    }

                    if(animated !== 'false'){
                        if(animated === 'both'){
                            animate = true;
                        }else if(checked && (animated === 'checked')){
                            animate = true;
                        }else if(!checked && (animated === 'unchecked')){
                            animate = true;
                        }else if(animated === ':markers'){
                            animate = true;
                            animateMarker = true;
                        }else if(animated === ':marker1'){
                            animate = true;
                            animateMarker = 1;
                        }else if(animated === ':marker2'){
                            animate = true;
                            animateMarker = 2;
                        }
                    }
                    let destValue = '', sourceValue, sourceValue2;

                    sourceValue = at(box, sourceAttr).value('');
                    

                    if(!animateMarker) {
                        destValue = at(box, destAttr).value('');
                    }
           
                    //get toggle values
                    let animeValues = sourceValue.split('|'); 
                    
                    //set unchecked toggle values in array
                    sourceValue = animeValues[0].split(' ');
                    destValue = destValue.split(' ');

                    if(animeValues.length > 1){
                       //set checked toggle values in array
                       sourceValue2 = animeValues[1].split(' ');
                    }
                   
                    if(typeof assign.alter === 'function'){
                        let mod = assign.alter(sourceValue);
                        if(Array.isArray(mod)){
                            sourceValue = mod;
                        }

                        if(sourceValue2){
                            let mod2 = assign.alter(sourceValue2);
                            if(Array.isArray(mod2)){
                                sourceValue2 = mod2;
                            }                           
                        }
                    }
 
                    if(!animateMarker){

                        let CDestValue; // old destination value
                        let CNewDestVal; // new destination value

                        let appliedSource = '';

                        //set default destination values
                        CDestValue = at(box, destAttr).attrvals(' ');

                        if(animated === 'both'){

                            //resolve for "both" modifer
                            if(sourceValue) {
                                //remove source value 1 from CDestValue
                                CNewDestVal = CDestValue.filter(value => !sourceValue.includes(value));
                                // add source value 1 to destination attribute
                                CNewDestVal = CNewDestVal.concat(sourceValue);
                                appliedSource = CNewDestVal;
                            }

                        } else {

                            let modchecked = checked;
                            modchecked = (animated === 'unchecked')? !checked : checked;

                            //resolve "checked" and "unchecked" modifers
                            if(modchecked){
                                if(sourceValue2){
                                    //remove source value 1 from CDestValue
                                    CNewDestVal = CDestValue.filter(value => !sourceValue.includes(value));

                                    // add source value 2 to destination attribute
                                    CNewDestVal = CNewDestVal.concat(sourceValue2);
                                    appliedSource = sourceValue2;
                                } else {

                                    // add source value 1 to destination attribute
                                    CNewDestVal = CDestValue.concat(sourceValue);
                                    appliedSource = sourceValue;

                                }
                            }else{

                                if(sourceValue2){
                                
                                    // remove source value 2 from destination attribute
                                    CNewDestVal = CDestValue.filter(value => !sourceValue2.includes(value));
                                    
                                    //add source value 1 to checkerDestValue (CNewDestVal)
                                    CNewDestVal = CNewDestVal.concat(sourceValue);
                                    appliedSource = sourceValue;

                                }else{
                                    // remove source value 1 from destination attribute
                                    CNewDestVal = CDestValue.filter(value => !sourceValue.includes(value));
                                }

                            }
                        }



                        //animation for custom box

                        //remove animation first ...
                        if(appliedSource){
                            //remove applied source value first 
                            let stripSource = CNewDestVal.filter(value => !appliedSource.includes(value))
                            box.setAttribute(destAttr, stripSource.join(' ')) 
                            setTimeout(() => box.setAttribute(destAttr, CNewDestVal.join(' ')), 20)
                        } else {

                            //add full data
                            box.setAttribute(destAttr, CNewDestVal.join(' '))
                        }


                    }else {

                        if(markers.length > 0){

                            //define variables 
                            let marker1Val, marker2Val; //old destination values
                            let M1NewDestVals, M2NewDestVals; // new destination values
                            let M1SourceValue, M2SourceValue // piped sources values

                            //set source values
                            M1SourceValue = sourceValue; //marker1 source value
                            M2SourceValue = sourceValue2 || sourceValue; //marker 2 source value
                            
                            //set default destination values
                            marker1Val = at(markers[0], destAttr).attrvals(' ');

                          
                            if(markers.length > 1) {
                                marker2Val = at(markers[1], destAttr).attrvals(' ');
                            }

                            if(checked){

                                if(animateMarker === 1){
                                    // marker 1 is hidden, remove value from marker 1
                                    
                                    // //add source to only marker 1
                                    M1NewDestVals = M1SourceValue.filter(val => !marker1Val.includes(val));    
                                    M1NewDestVals = marker1Val.concat(M1NewDestVals);
                                     
                                    //remove source from marker 2 (main action)
                                    M2NewDestVals = marker2Val.filter(val => !M2SourceValue.includes(val));                                    
                                }else if(animateMarker === 2){
                                    //add source to only marker 2 
                                    M2NewDestVals = M2SourceValue.filter(val => !marker2Val.includes(val) && (val !== ''));    
                                    M2NewDestVals = marker2Val.concat(M2NewDestVals);

                                    //remove source from marker 1
                                    M1NewDestVals = marker1Val.filter(val => !M1SourceValue.includes(val));
                                }else if(animateMarker === true){
                                    //add source to marker 2
                                    M2NewDestVals = M2SourceValue.filter(val => !marker2Val.includes(val));    
                                    M2NewDestVals = marker2Val.concat(M2NewDestVals);
                                    
                                    //remove source from marker 1
                                    M1NewDestVals = marker1Val.filter(val => !M1SourceValue.includes(val));
                                }

                            }else{

                                // Resolve this when checkbox is unchecked

                                if(animateMarker === 1){
                                    
                                    //marker 1 is visible, add attribute to marker 1

                                    // add source to marker 2
                                    // M2NewDestVals = M2SourceValue.filter(val => !marker2Val.includes(val));    
                                    // M2NewDestVals = marker2Val.concat(M2NewDestVals);

                                    //remove source from marker 1
                                    M1NewDestVals = marker1Val.filter(val => !M1SourceValue.includes(val));   

                                }else if(animateMarker === 2){

                                    //marker 2 is hidden, remove source value from marker 2

                                    // add source value to marker 1
                                    // M1NewDestVals = M1SourceValue.filter(val => !marker1Val.includes(val));    
                                    // M1NewDestVals = marker1Val.concat(M1NewDestVals);

                                    //remove source value from marker 2
                                    M2NewDestVals = marker2Val.filter(val => !M2SourceValue.includes(val));                                    

                                }else if(animateMarker === true){
                                    //add source to marker 1
                                    M1NewDestVals = M1SourceValue.filter(val => !marker1Val.includes(val));    
                                    M1NewDestVals = marker1Val.concat(M1NewDestVals);

                                    //remove source from marker 2
                                    if(marker2Val) M2NewDestVals = marker2Val.filter(val => !M2SourceValue.includes(val));
                                    
                                }else{
                                    console.error(`Markers must be 2 when set as ':markers'`)
                                }   

                            }

                            //set marker 1 and marker 2 new values ... 
                            if(M1NewDestVals) {
                                markers[0].setAttribute(destAttr, M1NewDestVals.join(' '));
                            }
                            if(M2NewDestVals) {                            
                                //console.log(M2NewDestVals.join(' '));
                                markers[1].setAttribute(destAttr, M2NewDestVals.join(' '));
                            }
        
                        }

                    }

                    
                }


            }

        }
        
        checkEvent = function(input){
            let customBox, checker = {};
                    
            //get custom box element 
            customBox = input.previousElementSibling;

            if(input.tagName === 'INPUT'){

                checker.native = input;
                checker.custom = customBox;
                checker.marker = customBox.querySelectorAll(checkbox.marker);
                checker.value = input.value;
                checker.label = customBox.getAttribute('data-label');
                checker.color = customBox.getAttribute('data-color');
                checker.listId = 0;
                checker.checkedBoxes = 0;


                let callback = customBox.getAttribute('data-func');
                
                let marker1, marker2, flip = checkbox.flip;
                let label, labels = [], label1, label2;
                let color, colors = [], color1, color2;
                let mColor = false;

                let customParent = customBox.parentNode.closest('[data-role="checkbox"]');
                let customLabel  = (customParent)? customParent.nextElementSibling : undefined; 

                if(customParent){
                    checker.parent = customParent;
                    let grandParent = customParent.parentNode.closest('[data-role="checkbox-list"]');
                    if(grandParent){
                        checker.parentSuper = grandParent;
                        checker.listId = Array.from(grandParent.children).indexOf(customParent); 
                        checker.checkedBoxes = grandParent.querySelectorAll('input:checked').length
                    }
                }

                if(customLabel && (customLabel.getAttribute('data-access') !== 'label')){
                    customLabel = undefined;
                }
                
                label = input.nextElementSibling;

                if(label && (label.getAttribute('data-access') !== 'label')){
                    label = undefined;
                }else if (customLabel) {
                    label = customLabel;
                }

                if(checker.label){
                    if(label && (label.getAttribute('data-access') === 'label')){
                        if(typeof checker.label === 'string'){
                            labels = stringSplit(checker.label);
                            label1 = labels[0]; //uncheck
                            label2 = labels[1]; //checked
                        }
                    }
                }
                
                if(checker.color){
                    if(typeof checker.color === 'string'){
                        //get first character 
                        mColor = checker.color.charAt(0);
                        if(mColor === '@'){
                          mColor = true;
                          checker.color = checker.color.substring(1);
                        }else{
                          mColor = false;
                        }
                        colors = stringSplit(checker.color);
                        color1 = colors[0];
                        color2 = colors[1];
                    }
                }

                if(at(customBox,'data-flip').is('true')){
                    flip = true;
                }else if(at(customBox,'data-flip').is('false')){
                    flip = false;
                }

                if((checkbox.marker.length > 1)){
                    marker1 = checker.marker[0];
                    marker2 = checker.marker[1];
                }

                if(input.disabled){
                    customBox.setAttribute('disabled', 'true');
                    if(customParent) customParent.setAttribute('disabled', 'true');
                    checker.disabled = true;
                }else{
                    customBox.removeAttribute('disabled');
                    if(customParent) customParent.removeAttribute('disabled');
                    checker.disabled = false;
                }

                if(input.checked) { 
                    //run for check
                    checker.checked = true;
                    input.setAttribute('checked', 'checked');
                    customBox.setAttribute('checked', 'checked');
                    if(customParent) customParent.setAttribute('checked', 'checked');
                    if(marker2 && flip){
                        marker1.setAttribute('hidden','');
                        marker2.removeAttribute('hidden');
                    }
                    if(label2){
                        label.textContent = label2;
                    }
                    if(label && color2) label.style.color = color2; 
                    if(mColor) {
                      if(marker2) {
                        marker2.style.color = color2;
                      }else if(marker1 &&  (color2 !== marker1.style.color)){
                        marker1.style.color = color2;
                      }
                    }
                }else{
                    //run for uncheck 
                    checker.checked = false;
                    input.removeAttribute('checked');
                    customBox.setAttribute('checked', 'unchecked'); 
                    if(customParent) customParent.setAttribute('checked', 'unchecked');
                    if(marker2 && flip){
                        marker2.setAttribute('hidden','');
                        marker1.removeAttribute('hidden');
                    }
                    if(label1){
                        label.textContent = label1;
                    }
                    if(label && color1) label.style.color = color1;
                    if((mColor=== true) && marker1) marker1.style.color = color1;
                }

                if(typeof animeAttr === 'function'){
                    animeAttr(customBox, input.checked, customBox.getAttribute('data-assign'), checker.marker)
                }

                checker.init = init;

                if(typeof toggle === 'function') toggle(checker);
                
                if(callback) {
                    window[callback](checker);
                }

            }else{

                console.error('next element of custom checkbox must be an input checkbox')

            }
        }

        // let checkLists = input.closest('[data-role="checkbox-list"');
        let checkLists = document.querySelectorAll('[data-role="checkbox-list"]:not([initialized])');

        checkLists.forEach(checkList => {

            //get all custom checkboxes in the checkbox list...
            let customLists = checkList.querySelectorAll(checkbox.target);

            if(customLists.length > 0){
                
                checkList.setAttribute('initialized', true);
                let checkListBind = at(checkList, 'data-bind');
                let dataBindValue = checkListBind.value().split("-");
                let isSlide = false, slideTime = 2500;
                
                if(dataBindValue.length === 2){
                  isSlide = dataBindValue['0'] === 'slide';
                  slideTime = parseInt(dataBindValue['1']);
                  if(slideTime < 20) slideTime = 2500;
                }else if (checkListBind.is('slide')) {
                  isSlide = true;
                }
                
                if(checkListBind.is('radio') || isSlide){

                    customLists.forEach((customList, index) => {
                        
                        let mainChecker, subChecker, exToggles;

                        mainChecker = isCheckbox(customList.nextElementSibling);
    
                        if(mainChecker){
                            mainChecker.setAttribute('e-prev','');
                        }
                            
                        customList.addEventListener('click', function(){

                            if(mainChecker){
                              
                                if(at(mainChecker,'data-bind').not('free')){
                                    
                                    if(!hasChecked(mainChecker)) mainChecker.click();
                                    
                                    //remove index from selected boxes
                                    exToggles = {...customLists};
                                    delete exToggles[index];
        
                                    for(let exToggle in exToggles){
                                        subChecker = isCheckbox(exToggles[exToggle].nextElementSibling);
                                        
                                        if(at(subChecker,'data-bind').not('free')){
                                            if(hasChecked(subChecker)){
                                                subChecker.click(); //uncheck
                                            }
                                        }
                                    }
    
                                }else{ 
                                    mainChecker.click();
                                }
                            }
                        })
                        
                    })
                    
                    if(isSlide) {
                        //let autoSwitch = checkList; //checkbox-list
                        //let autoCheckers = checkList.querySelectorAll('[data-role="checkbox"');
                        let timeout;
                        
                        function autoSwitch() {
                            
                            let checkedBox = checkList.querySelector('[data-role="checkbox"][checked="checked"]') 
                            let checkedIndex = Array.from(checkList.children).indexOf(checkedBox);
                            if(customLists.length > 0) {
                              if((checkedIndex + 1) === customLists.length){
                                  checkedIndex = 0;
                              } else {
                                checkedIndex = checkedIndex + 1;
                              }
                              customLists[checkedIndex].addEventListener('click', function(){
                                if(timeout) clearTimeout(timeout);
                                timeout = setTimeout(() => {
                                    autoSwitch()
                                }, slideTime)
                              });
                              customLists[checkedIndex].click();
                            }
                        }
                        
                        timeout = setTimeout(() => { autoSwitch(); }, 1000);
                      
                    }
                    
                }else if(checkListBind.is('base')){
                    
                    customLists.forEach((customList, index) => {

                        let mainChecker = isCheckbox(customList.nextElementSibling);

                        if(isCheckbox(mainChecker)){
                            mainChecker.setAttribute('e-prev', '')
                        }

                        customList.addEventListener('click', function(){

                            let exToggles, subChecker;
                            
                            //remove index from selected boxes
                            exToggles = {...customLists};
                            delete exToggles[index];
                            
                            if(mainChecker && !mainChecker.disabled){
                              
                              if(index === 0){
                                  
                                  mainChecker.click();
                                  
                                  if(!mainChecker.getAttribute('escape')) {
                                    
                                    for(let exToggle in exToggles){
    
                                        subChecker = isCheckbox(exToggles[exToggle].nextElementSibling);
                                        
                                        if(subChecker && !subChecker.disabled && !checkbox.hardchecks.includes(subChecker)){
                                          
                                          let subCheckerBind = at(subChecker, 'data-bind');
                                          
                                          if(subCheckerBind.not('free')){
                                            
                                            if(subCheckerBind.is('reverse')){
                                              let reverse = mainChecker.checked === subChecker.checked;
                                              
                                              if( reverse ) subChecker.click() //reverse
                                              
                                            }else{
                                              
                                              let reflect = mainChecker.checked !== subChecker.checked;
                                              
                                              if( reflect ) subChecker.click();
                                              
                                            }
                                            
                                          }
                                          
                                        }
    
                                    }
                                    
                                  } else {
                                    
                                    mainChecker.removeAttribute('escape')
                                    
                                  }
  
                              } else {
                                  
                                  //handle other boxes

                                  if(at(mainChecker,'data-bind').not(['free'])){
                                      
                                      let isReverse = at(mainChecker,'data-bind').is('reverse');
                                      let rootChecker = isCheckbox(customLists[0].nextElementSibling) 
  
                                      if(isReverse){
                                          mainChecker.click()
                                          
                                          if(rootChecker){ 
                                            if(mainChecker.checked === rootChecker.checked){
                                                customLists[0].click(); //click respective items
                                            }
                                          }
                                      }else{
                                        
                                        if(mainChecker.checked){ 
                                          mainChecker.click(); //uncheck 

                                          function reverseBoxes(){
                                            let reversed = [];
                                            let toggleOn = true;
                                            for(let exToggle in exToggles){
                                                let remToggle = exToggles[exToggle].nextElementSibling;
                                                let remToggleBind = at(remToggle, 'data-bind');
                                                
                                                if(remToggleBind.not(['free', 'reverse'])){
                                                    if(remToggle.checked){
                                                        toggleOn = false
                                                        break;
                                                    }
                                                }else if(remToggleBind.is('reverse')) {
                                                    reversed.push(exToggles[exToggle]);
                                                }
                                            }

                                            if(toggleOn){

                                                reversed.forEach(reverse => {
                                                    if(!reverse.checked){
                                                        reverse.click();
                                                    }
                                                })

                                            }
                                          }

                                          if(rootChecker.checked){
                                            rootChecker.click(); //uncheck only root
                                            reverseBoxes()
                                          }else{
                                            //check all children not checked
                                            reverseBoxes();
                                          }
                                        }else{
                                          
                                          mainChecker.click(); //check 
                                          
                                          //check if all boxes are checked before checking main box 
                                          delete exToggles[0];
                                          delete exToggles[index];
                                          let toggleOn = true;
                                          for(let exToggle in exToggles){
                                            let remToggle = exToggles[exToggle].nextElementSibling;
                                            let remToggleBind = at(remToggle, 'data-bind');
                                            
                                            if(remToggleBind.not(['free', 'reverse'])){
                                                if(!remToggle.checked && (toggleOn !== false)){
                                                    toggleOn = false
                                                    break;
                                                }
                                            }
                                          }
                                        
                                          if(toggleOn && !rootChecker.checked){
                                            //click only parent checkbox when others are checked
                                            customLists[0].click();
                                          }
                                          
                                        }
  
                                      }
                                      
                                  }else{
                                      if(!mainChecker.disabled && !checkbox.hardchecks.includes(mainChecker)){
                                          mainChecker.click();
                                      }
                                  }
  
                              }
                              
                            }

                        })
                        
                    })
                }else if(checkListBind.is('rating')){
                  
                    //add touch sliding effects here 

                    customLists.forEach((customList, index) => {

                        customList.addEventListener('click', function(){
                            
                            let exToggles = {...customLists};
                            
                            let boxes = Object.keys(exToggles).length;
                               
                           
                            for(let i = boxes - 1; i > index; i--){
                              let checkboxItem = exToggles[i].nextElementSibling;
                              if(checkboxItem.checked){
                                customLists[index].setAttribute('check-pause', 'true')
                                //get next element item
                                customLists[i].click();
                              }
                            }
                            
                           for(let i = 0; i <= index; i++){
                              let checkboxItem = exToggles[i].nextElementSibling;
                              if(!checkboxItem.checked){
                                customLists[i].click();
                              }
                            }
                           

                        })
                        
                        touchSlide(checkList, checkbox.target)

                    })

                }
                
            }

        })

        //Handle Animation ............................

        customBoxes.forEach(customBox => {

            //set custom checkbox sibling
            let input = customBox.nextElementSibling;
                        
            if(input.getAttribute('checked') === 'false'){
                input.checked = false;
                input.removeAttribute('checked')
            }else if(input.getAttribute('checked') === 'true') {
                input.checked = true;
                input.setAttribute('checked','checked')
            }
            
            let inputType = input.getAttribute('type');

            let defaultSize = getSize(size);
            let attributeSize = getSize(customBox.getAttribute('data-size'));
            let customSize = {...defaultSize,...attributeSize}
   
            let customFSize = customBox.getAttribute('data-fsize');
            let checker = {} 

            if(
                (input.tagName === 'INPUT') && inputType &&
                (inputType.toLowerCase() === 'checkbox')
            ){

                let marker, marker1, marker2, flip;
                let labels = [], label1, label2, label;
                let colors = [], color1, color2, mColor = false;
                let customParent, customLabel;
                let callback, eager = false;

                input.setAttribute('hidden', '');

                checker.label = customBox.getAttribute('data-label') || '';
                checker.color = customBox.getAttribute('data-color') || '';
                
                callback = customBox.getAttribute('data-func');

                eager = at(customBox).hasAttr('data-init');

                marker = customBox.querySelectorAll(checkbox.marker);
                flip = checkbox.flip;

                customParent = customBox.parentNode.closest('[data-role="checkbox"]');
                customLabel  = (customParent)? customParent.nextElementSibling : undefined;
                
                if(customLabel && (customLabel.getAttribute('data-access') !== 'label')){
                    customLabel = undefined;
                }

                label = input.nextElementSibling;

                if(label && (label.getAttribute('data-access') !== 'label')){
                    label = undefined;
                }

                if(!label && customLabel) label = customLabel;

                if(checker.label){
                    if(label){
                        if(typeof checker.label === 'string'){
                            labels = stringSplit(checker.label);
                            label1 = labels[0]; //uncheck
                            label2 = labels[1]; //checked
                        }
                    }
                }
                
                if(checker.color){
                    //get first character 
                    mColor = checker.color.charAt(0);
                    if(mColor === '@'){
                      mColor = true;
                      checker.color = checker.color.substring(1);
                    }else{
                      mColor = false;
                    }
                    colors = checker.color.split("|");
                    if(colors.length > 0){
                        color1 = colors[0]; //uncheck
                        color2 = colors[1]; //checkeds
                    }
                }

                if(marker.length > 0 && !css){

                    let style, styleCss = ''; let id = btoa(`${checkbox.target} ${checkbox.marker}`);

                    let styleExists = document.querySelector(`style[checkbox="${id}"]`);

                    if(!styleExists){

                        style = document.createElement('style');
                        style.setAttribute('id',`${id}`);
    
                        if(size && customSize){
                            styleCss += `
                                width: ${customSize.x};
                                height: ${customSize.y};
                            `
                        }
    
                        if(fsize){
                            styleCss += `
                                font-size: ${customFSize};
                            `
                        }
    
                        if(fit){
                            styleCss += `
                                background-size: cover;
                                background-position: center top;
                                background-repeat: no-repeat;
                            `
                        }
        
                        if(styleCss !== ''){
                            styleCss = `
                            ${checkbox.target} ${checkbox.marker} {
                                ${styleCss}
                            }
                            `
                            style.textContent = styleCss;
                            document.head.appendChild(style);
                        }

                    }
                    css = true;  

                }

                
                if(at(customBox,'data-flip').is('true')){
                    flip = true;
                }else if(at(customBox,'data-flip').is('false')){
                    flip = false;
                }

                if((marker.length > 0)){
                    marker1 = marker[0];
                    marker2 = marker[1];
                } else {
                    if(customSize) {
                        if(customSize.x !== '') customBox.style.width = customSize.x;
                        if(customSize.y !== '') customBox.style.height = customSize.y;
                    }
                }

                if(marker1){
                    if(customSize){
                        marker1.style.width = customSize.x;
                        marker1.style.height = customSize.y;
                        if(marker2) marker2.style.width = customSize.x;
                        if(marker2) marker2.style.height = customSize.y;
                    }
                    if(customFSize){
                        marker1.style.fontSize = customFSize;
                        if(marker2) marker2.style.fontSize = customFSize;
                    }
                }

                if(input.disabled){
                    checkbox.hardchecks.push(input);
                    checkbox.hardchecks.push(customBox);
                    customBox.setAttribute('disabled', 'true');
                    if(customParent) customParent.setAttribute('disabled', 'true');
                }

                //set default behaviour
                if(input.checked){
                    customBox.setAttribute('checked', 'checked'); 
                    if(customParent) customParent.setAttribute('checked', 'checked');
                    if(marker2 && flip){
                        marker1.setAttribute('hidden','');
                        marker2.removeAttribute('hidden');
                    }
                    
                    if(label1){
                        label.textContent = label2;
                    }

                    //apply second color to label only if second color is defined 
                    if(color2 && label1) label.style.color = color2;  
                    
                    //apply color to markers if first or second color is defined
                    if(color1 && marker1 && mColor) {
                        if(!color2){
                            marker1.style.color = color1;
                        }else{
                            marker1.style.color = color2;
                        }
                    }
                    if(color2 && marker2 && mColor) marker2.style.color = color2;

                }else{
                    customBox.setAttribute('checked', 'unchecked');
                    if(customParent) customParent.setAttribute('checked', 'unchecked');
                    if(marker2 && flip){
                        marker1.removeAttribute('hidden');
                        marker2.setAttribute('hidden','');
                    }  
                    
                    if(label1){
                        label.textContent = label1;
                    }

                    if(color1 && label) label.style.color = color1;     
                    if(color1 && marker1 && mColor) marker1.style.color = color1;
                    if(color2 && marker2 && mColor) marker2.style.color = color2;
                }
                
                let grandParent, checkedBoxes;
                
                // get checkbox-list and selections
                if(customParent){
                  grandParent = customParent.closest('[data-role="checkbox-list"]');
                  if(grandParent) {
                    checkedBoxes = grandParent.querySelectorAll('input:checked').length
                  }
                }
                
                let properties = {
                  native:input, 
                  custom: customBox, 
                  marker: marker, 
                  checked: (input.checked), 
                  fit: checkbox.fit, 
                  flip: flip, 
                  value: (input.value),
                  checkList: grandParent, //checkbox list
                  parent: customParent, //data role checkbox
                  checkedBoxes: checkedBoxes,                  
                }

                if(typeof init === 'function'){
                    if(typeof animeAttr == 'function'){
                        animeAttr(customBox, input.checked, customBox.getAttribute('data-assign'), marker)
                    }
                    init(properties);
                }else if (init === true) {
                    if(typeof animeAttr == 'function'){
                        animeAttr(customBox, input.checked, customBox.getAttribute('data-assign'), marker)
                    }
                }

                if(eager && callback !== ''){
                    window[callback](properties)
                }

                input.addEventListener('click', function(e){

                    if(input.getAttribute('disabled')  || checkbox.hardchecks.includes(input)){
                        e.preventDefault();
                    }else{
                        if(!this.getAttribute('selection')) {
                            checkEvent(this)
                        }else{
                            this.removeAttribute('selection');
                            e.preventDefault();
                        }
                    }

                });

                customBox.addEventListener('click', function(){
                    
                    
                    if(grandParent){

                        checkedBoxes = properties.checkedBoxes;
                        
                        //checkedBoxes = grandParent.querySelectorAll('input:checked').length
         
                        if(at(grandParent).hasAttr('data-max')) {
                            let max, callback;

                            if(at(grandParent).hasAttr('data-maxim')){
                                callback = at(grandParent,'data-maxim').value();
                            }

                            max = parseInt(at(grandParent, 'data-max').value()); 
                            if((checkedBoxes === max) && !at(customBox,'checked').is('checked')) {

                                if(typeof window[callback] === 'function') {
                                    let props = {};
                                    props.checked = grandParent.querySelectorAll(checkbox.target+'[checked="checked"]');
                                    props.unchecked = grandParent.querySelectorAll(checkbox.target+':not([checked="checked"])');
                                    props.max = true;
                                    window[callback](props);
                                }
                                return false;
                                
                            } else {

                                if(typeof window[callback] === 'function') {
                                    let props = {};
                                    props.checked = grandParent.querySelectorAll(checkbox.target+'[checked="checked"]');
                                    props.unchecked = grandParent.querySelectorAll(checkbox.target+':not([checked="checked"])');
                                    props.max = false;
                                    window[callback](props);
                                }                                

                            }
                            
                            // else if (checkedBoxes < max){
                                 
                            //         if(typeof window[callfront] === 'function') {
                            //             let props = {};
                            //             props.checked = grandParent.querySelectorAll(checkbox.target+'[checked="checked"]');
                            //             props.unchecked = grandParent.querySelectorAll(checkbox.target+':not([checked="checked"])');
                            //             window[callfront](props);
                            //         } 
                            // }
                        }
                    }
                    //if not e-prev defined
                    if(!at(customBox, 'check-pause').is('true')){
                      if(input.getAttribute('e-prev') === null){
                          if(!at(customBox).hasAttr('controllers')) input.click();
                          input.setAttribute('selection', 'true');
                          setTimeout(() => input.removeAttribute('selection'), 50);
                      }
                    }else{
                      customBox.removeAttribute('check-pause');
                    }
                })

                if(label){
                    label.addEventListener('click', function(){
                        customBox.click();
                    })
                }  
                
                if(at(customBox).hasAttr('data-control')){

                    let auto  = false;

                    let controller = at(customBox,'data-control').value('');

                    if(controller === 'reload'){
                        controller = ':markers';
                        auto = true;
                    }

                    if(controller !== ''){
                        let parent, markers;

                        if(controller === ':markers'){
                            markers = controller;
                        }else{
                            parent = controller;
                            parent = customBox.closest(parent);
                        }

                        if(parent){
                            parent.addEventListener('click', function(){
                                 customBox.click();
                                 if(input.checked){
                                    parent.setAttribute('checked', 'checked')
                                 }else{
                                    parent.removeAttribute('checked')
                                 }
                            })
                        }else if(markers){

                            customBox.setAttribute('controllers', '');
                            
                            if(marker1 && marker2){

                                marker1.addEventListener('click', function(){
                                    if(input.checked){
                                        input.click(); //uncheck
                                    }
                                })

                                marker2.addEventListener('click', function(){
                                    if(!input.checked){
                                        input.click(); //check
                                    }
                                })

                            }
                            if(auto) input.click();
                        }

                    }
                }

            }

        })
        
        // handle touch sliding animation ..... 
        function touchSlide(ratebind, target){
          
            const rateboxes = ratebind.querySelectorAll('[data-role="checkbox"]');
            let startCheckbox; let mousePressed;

            rateboxes.forEach((ratebox) => {
              ratebox.addEventListener('touchstart', handleTouchStart);
              ratebox.addEventListener('touchmove', handleTouchMove);
              ratebox.addEventListener('mousedown', handleTouchStart);
              ratebox.addEventListener('mousemove', handleTouchMove);
              ratebox.addEventListener('mouseup', handleMouseEnd);
            });

            function handleTouchStart(event) {
              startCheckbox = event.currentTarget;
              let customBox = startCheckbox.querySelector(target);
              mousePressed = true;
              if((getIndex(startCheckbox) === 0) && !isChecked(customBox)){ 
                // customBox.click();********************************************
              }
            }

            function handleTouchMove(event) {
              event.stopPropagation();
              let currentCheckbox; let customBox;

              if(event.touches){
                 currentCheckbox = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
                }else{
                  if(mousePressed) {
                      currentCheckbox = document.elementFromPoint(event.clientX, event.clientY);
                  }
              }
              if(currentCheckbox) customBox = currentCheckbox.querySelector(target);
              
              if (customBox && (currentCheckbox !== startCheckbox)) {
                
                const checkex = customBox.nextElementSibling;
                let front = isForwardSlide(startCheckbox, currentCheckbox);
                let backs = isBackwardSlide(startCheckbox, currentCheckbox);
                let neutral = (front === false) && (backs === false);
                
                //startCheckbox = currentCheckbox;
                let checkNum = getIndex(currentCheckbox);
                // permit activity: if item is checkbox
                let isCheckBox = currentCheckbox.getAttribute('data-role') === 'checkbox';
                
                if(isCheckBox) {
                  startCheckbox = currentCheckbox;

                    if(front && !isChecked(customBox)){
                      for(let i = 0; i < checkNum; i++){
                        let ltCheck = rateboxes[i].querySelector(target)
                        if(!ltCheck.nextElementSibling.checked){
                          ltCheck.click()
                        }
                      }
                      customBox.click();
                     
                    } else if (backs && !neutral){
                      for(let i = rateboxes.length - 1; i > checkNum; i--){
                        let ltCheck = rateboxes[i].querySelector(target)
                        if(ltCheck.nextElementSibling.checked){
                          ltCheck.click()
                        }
                      }
                    }
                  
                }

              }
              
            }

            function handleMouseEnd(event){
                mousePressed = false;
            }

            function isForwardSlide(startCheckbox, currentCheckbox) {
              // Logic to determine if the slide is forward
              return currentCheckbox.offsetLeft > startCheckbox.offsetLeft;
            }
            
            function isBackwardSlide(startCheckbox, currentCheckbox) {
              // Logic to determine if the slide is backward
              //return startCheckbox.offsetLeft > currentCheckbox.offsetLeft;
              // Get the index of the current and start checkboxes
              const currentIndex = getIndex(currentCheckbox);
              const startIndex = getIndex(startCheckbox);
            
              // Logic to determine if the slide is forward
              return currentIndex < startIndex;
            }
            
            function isChecked(customBox) {
              // Logic to determine if the custom box has the checked attribute
              return customBox.getAttribute('checked') === "checked";
            }
         
            // Helper function to get the index of the checkbox in its parent
            function getIndex(checkbox) {
              return Array.from(checkbox.parentNode.children).indexOf(checkbox);
            }
          
        }
        
    }

    check(config) {
        new CheckBox(config);
    }

}