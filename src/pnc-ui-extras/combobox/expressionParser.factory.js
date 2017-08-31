/**
 * The work in this file is entirely the work of the AngularUI team, with only
 * extremely minor of modifications. Copyright attribution and license:
 *
 * The MIT License
 *
 * Copyright (c) 2012-2017 the AngularUI Team, https://github.com/organizations/angular-ui/teams/291112
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
const pxExpressionParser = ($parse) => {
  const TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
   return {
     parse: (input) => {
       let match = input.match(TYPEAHEAD_REGEXP);
       if (!match) {
         throw new Error(
           'Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' +
             ' but got "' + input + '".');
       }

       return {
         itemName: match[3],
         source: $parse(match[4]),
         viewMapper: $parse(match[2] || match[1]),
         modelMapper: $parse(match[1])
       };
     }
   };
 };

pxExpressionParser.$inject = ['$parse'];

angular.module('pnc-ui-extras.combobox')
       .factory('pxExpressionParser', pxExpressionParser);
