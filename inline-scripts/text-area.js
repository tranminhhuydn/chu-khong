/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

(function(app) {
  const d = document;
d.id = (id) => {
    return d.getElementById(id)
};
d.create = (tag, objs, parent) => {
    var c = d.createElement(tag);
        //for (var attr in objs) c[attr] ? c.setAttribute(attr, objs[attr]) : (c[attr] = objs[attr]);
        if (objs)
            for (var attr in objs){
              if(c[attr]){
                c.setAttribute(attr, objs[attr])
              }else{
                c[attr] = objs[attr];
                c.setAttribute(attr, objs[attr])
              }
            } 
        if (parent) parent.append(c);
        return c
    };
    d.autoLoadId = () => {
        var globals = d.querySelectorAll('[id]');

        function toTitleCase(str) {
            var c = str.replace(/(\w+)/g, (txt) => {
                return txt.charAt(0).toUpperCase() + txt.substr(1);
            }).replace(/([^\w])/g, '');
            return c.charAt(0).toLowerCase() + c.substr(1);
        };
        globals.forEach(e => {
            var id = toTitleCase(e.id);
            window[id] = d.id(e.id)
            window[id].q = window[id].querySelector
            window[id].qAll = window[id].querySelectorAll
        })
    }
    d.q = d.querySelector;
    d.qAll = d.querySelectorAll;

    d.fns = []
    d.init = function(cb){
        if(cb) 
            d.fns.push(cb)
    }
    d.loadFns = function(){
        d.fns.map(i=>{
            i()
        })
    }

  app.d = d

  const textArea = d.id('textEditor');

  /* Setup the main textarea */
  textArea.addEventListener('input', () => {
    app.setModified(true);
  });

  /* Hide menus any time we start typing */
  textArea.addEventListener('focusin', () => {
    myMenus.hideAll();
  });

  /* Listen for tab key */
  textArea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && app.options.captureTabs) {
      e.preventDefault();
      app.insertIntoDoc('\t');
    }
  });

  /* Initialize the textarea, set focus & font size */
  window.addEventListener('DOMContentLoaded', () => {
    textArea.style.fontSize = app.options.fontSize;
    //textArea.style.fontSize = `${app.options.fontSize}px`;
    app.setFocus();
  });


  /**
   * Sets the text of the editor to the specified value
   *
   * @param {string} val
   */
  app.setText = (val) => {
    val = val || '';
    textArea.value = val;
  };

  /**
   * Gets the text from the editor
   *
   * @return {string}
   */
  app.getText = () => {
    return textArea.value;
  };

  /**
   * Inserts a string into the editor.
   *
   * @param {string} contents Contents to insert into the document.
   */
  app.insertIntoDoc = (contents) => {
    // Find the current cursor position
    const startPos = textArea.selectionStart;
    const endPos = textArea.selectionEnd;
    // Get the current contents of the editor
    const before = textArea.value;
    // Get everything to the left of the start of the selection
    const left = before.substring(0, startPos);
    // Get everything to the right of the start of the selection
    const right = before.substring(endPos);
    // Concatenate the new contents.

    document.execCommand("insertText", false, contents);
    //textArea.value = left + contents + right;

    // Move the cursor to the end of the inserted content.
    const newPos = startPos + contents.length;
    textArea.selectionStart = newPos;
    textArea.selectionEnd = newPos;
    app.setModified(true);
  };


  app.getTextSelection = (startPos,endPos)=>{
      startPos = startPos||textArea.selectionStart;
      endPos = endPos||textArea.selectionEnd;
      // Get the current contents of the editor
      const before = textArea.value;

      return before.substring(startPos, endPos);
  }
  app.getTextPreviousLine = ()=>{
    var textArea = d.id('textEditor');
    var linePrevious = textArea.value.lastIndexOf('\n',textArea.selectionStart-2)
    linePrevious=linePrevious==-1?0:linePrevious
    //console.log(linePrevious);
    var lineNext = textArea.value.indexOf('\n',textArea.selectionStart)
    lineNext = lineNext==-1?textArea.selectionStart:lineNext
    //console.log(lineNext);
    var text = textArea.value.substring(linePrevious,lineNext).replace(/\n/g,'')
    //console.log(text);
    return text;
  }

  /**
   * Adjust the font size of the textarea up or down by the specified amount.
   *
   * @param {Number} val Number of pixels to adjust font size by (eg: +2, -2).
   */
  app.adjustFontSize = (val) => {
    const newFontSize = app.options.fontSize + val;
    if (newFontSize >= 2) {
      textArea.style.fontSize = `${newFontSize}px`;
      app.options.fontSize = newFontSize;
    }
    appStore.set('options',app.options)
    gaEvent('Options', 'Font Size', null, newFontSize);
  };

  /**
   * Moves focus to the text area, and potentially cursor to position zero.
   *
   * @param {boolean} startAtTop
   */
  app.setFocus = (startAtTop) => {
    if (startAtTop) {
      textArea.selectionStart = 0;
      textArea.selectionEnd = 0;
      textArea.scrollTo(0, 0);
    }
    textArea.focus();
  };

  app.select = (start,end)=>{
    textArea.select()
    textArea.selectionStart = start?start:textArea.selectionStart;
    textArea.selectionEnd = end?end:textArea.selectionEnd;
  }

  app.textArea= textArea
})(app);
