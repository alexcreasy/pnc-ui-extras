class PxExpressionController {
  constructor($log, $q, $scope, $attrs, pxExpressionParser) {
    this.$log = $log;
    this.$q = $q;
    this.$scope = $scope;
    this.$attrs = $attrs;
    this.pxExpressionParser = pxExpressionParser;

    this.parsed = pxExpressionParser.parse($attrs.pxExpression);

    this.$log.debug('PxExpressionController::constructor() with scope id = ' + $scope.$id);
    this.$log.debug('px-expression = ' + $attrs.pxExpression, $scope);
  }

  getViewValue(item) {
    let locals = {};
    locals[this.parsed.itemName] = item;
    return this.parsed.viewMapper(this.$scope, locals);
  }

  getModelValue(item) {
    let locals = {};
    locals[this.parsed.itemName] = item;
    return this.parsed.modelMapper(this.$scope, locals);
  }

  getOptions(viewValue) {
    return this.$q.when(this.parsed.source(this.$scope, { $viewValue: viewValue }));
  }
}

PxExpressionController.$inject = ['$log', '$q', '$scope', '$attrs', 'pxExpressionParser'];


const pxExpression = () => {
  return {
    restrict: 'A',
    scope: false,
    controller: PxExpressionController,
  };
};

angular.module('pnc-ui-extras.combobox')
       .directive('pxExpression', pxExpression);
