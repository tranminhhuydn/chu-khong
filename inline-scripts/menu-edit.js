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
  var {d} = app
  d.id('cmdundo').addEventListener('click', () => {
    d.execCommand('undo');
    gaEvent('Edit', 'undo');
  });

  d.id('cmdredo').addEventListener('click', () => {
    d.execCommand('redo');
    gaEvent('Edit', 'redo');
  });
  d.id('cmdselectall').addEventListener('click', () => {
    d.execCommand('selectall');
    gaEvent('Edit', 'selectall');
  });
  d.id('cmdcopy').addEventListener('click', () => {
    d.execCommand('copy');
    gaEvent('Edit', 'copy');
  });
 d.id('cmdcut').addEventListener('click', () => {
    d.execCommand('cut');
    gaEvent('Edit', 'cmdcut');
  });
 d.id('cmdpaste').addEventListener('click', async () => {
    try {
      const t = await navigator.clipboard.readText();
      app.insertIntoDoc(t);
      app.setModified(true);
      app.setFocus();
      gaEvent('Edit', 'Paste');
    } catch (ex) {
      console.error('Unable to paste', ex);
      gaEvent('Error', 'Paste', ex.name);
    }
  });
    
  d.id('cmdHelp').addEventListener('click', () => {
    //d.execCommand("insertText", false, "the text to insert");
    gaEvent('Edit', 'cmdHelp');
  }); 

})(app);
