class ComboboxController {

  constructor($log, $scope, $element, $timeout) {
    const DEFAULT_OPTION_TEMPLATE_URL = 'pnc-ui-extras/combobox/combobox-option.template.html';

    this.$log = $log;
    this.$scope = $scope;
    this.$element = $element;
    this.$timeout = $timeout;

    this.options = []; // List of options for the user to select from
    this.showDropDown = false;
    this.modelOptions = {}; // Values for ng-model-options directive
    this.optionTemplateUrl = this.optionTemplateUrl || DEFAULT_OPTION_TEMPLATE_URL;
  }

  $onInit() {
    if (this.ngModel) {
      const editable = this.editable === true || this.editable === 'true';

      this.ngModel.$parsers.push(viewValue => {
        const option = this.getOptionFromViewValue(viewValue);

        if (angular.isDefined(option)) {
          return this.getModelValue(option);
        } else if (editable) {
          return viewValue;
        }
      });

      this.ngModel.$validators.isValidOption = (modelValue, viewValue) => {
        return angular.isDefined(this.getOptionFromModelValue(modelValue)) || editable;
      };

      this.ngModel.$render = () => this.inputModel = this.ngModel.$viewValue;

      this.ngModel.$formatters.push(modelValue => {
        const transformed = this.getViewValue(modelValue);

        if (angular.isDefined(transformed)) {
          return transformed;
        }

        const option = this.getOptionFromModelValue(modelValue);

        if (angular.isDefined(option)) {
          return this.getViewValue(option);
        } else if (editable) {
          return modelValue;
        }
      });

      this.$scope.$watch(
        () => this.inputModel,
        () => {
          this.ngModel.$setViewValue(this.inputModel);
          this.loadOptions(this.inputModel);
        }
      );

      if (this.debounceMs) {
        this.modelOptions.debounce = parseInt(this.debounceMs);
      }

    } else {
      this.loadOptions();
    }
  }

  $postLink() {
    if (this.ngModel) {
      this.$timeout(() => {
        this.$element.find('input').on('blur', () => {
          this.$scope.$applyAsync(() => this.ngModel.$setTouched());
        });
      });
    }
  }

  $onDestroy() {
    if (this.ngModel) {
      this.$element.find('input').off('blur');
    }
  }

  loadOptions(viewValue) {
    return this.pxExpression.getOptions(viewValue).then(options => {
      this.$log.debug('ComboboxController::loadOptions() scopeId = %d | options = %O', this.$scope.$id, options);
      this.$scope.$applyAsync(() => this.options = options);
      return options;
    });
  }

  getViewValue(option) {
    return this.pxExpression.getViewValue(option);
  }

  getModelValue(option) {
    return this.pxExpression.getModelValue(option);
  }

  getOptionFromViewValue(viewValue) {
    if (!angular.isArray(this.options)) {
      return;
    }
    return this.options.find(option => this.getViewValue(option) === viewValue);
  }

  getOptionFromModelValue(modelValue) {
    if (!angular.isArray(this.options)) {
      return;
    }
    return this.options.find(option => this.getModelValue(option) === modelValue);
  }

  setShowDropDown(value) {
    this.$scope.$applyAsync(() => this.showDropDown = value);
    if (!value) {
      this.highlighted = undefined;
    }
  }

  openDropDown() {
    this.setShowDropDown(true);
  }

  closeDropDown() {
    this.setShowDropDown(false);
  }

  toggleDropDown() {
    this.setShowDropDown(!this.showDropDown);
  }

  select(option) {
    this.inputModel = this.getViewValue(option);
    this.closeDropDown();
  }

  clear() {
    this.inputModel = undefined;
    this.closeDropDown();
  }

  setHighlighted(index) {
    this.highlighted = index;
  }

  isHighlighted(index) {
    return this.highlighted === index;
  }

  highlightNext() {
    if (!this.showDropDown || !this.options || this.options.length < 1) {
      return;
    }

    if (angular.isUndefined(this.highlighted)) {
      this.setHighlighted(0);
    } else if (this.highlighted === this.options.length - 1) {
      return;
    } else {
      this.setHighlighted(this.highlighted + 1);
    }
  }

  highlightPrevious() {
    if (!this.showDropDown || !this.options || this.options.length < 1) {
      return;
    }

    if (angular.isUndefined(this.highlighted) || this.highlighted === 0) {
      return;
    } else {
        this.setHighlighted(this.highlighted - 1);
    }
  }

  onKey($event) {
    $event.stopPropagation();
    $event.preventDefault();
    switch ($event.key) {
      case 'ArrowDown':
        if (!this.showDropDown) {
          this.openDropDown();
        } else {
          this.highlightNext();
        }
        break;
      case 'ArrowUp':
        this.highlightPrevious();
        break;
      case 'Enter':
        this.select(this.options[this.highlighted]);
        break;
      case 'Escape':
        this.closeDropDown();
        break;
    }
  }
}

ComboboxController.$inject = ['$log', '$scope', '$element', '$timeout'];

const pxCombobox = {
  templateUrl: 'pnc-ui-extras/combobox/combobox.template.html',
  controller: ComboboxController,
  require: {
    pxExpression: '?pxExpression',
    ngModel: '?ngModel'
  },
  bindings: {
    placeholder: '@',
    editable: '<',
    debounceMs: '@',
    optionTemplateUrl: '@'
  }
};

angular.module('pnc-ui-extras.combobox')
       .component('pxCombobox', pxCombobox);
