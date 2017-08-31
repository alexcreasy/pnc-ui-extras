'use strict';

describe('pnc-ui-extras module', function() {
  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function(module) {
    return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function() {
    module = angular.module('pnc-ui-extras');
    dependencies = module.requires;
  });

  it('should load combobox module', function() {
    expect(hasModule('pnc-ui-extras.combobox')).to.be.ok;
  });

});
