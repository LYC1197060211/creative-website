Component({
  properties: {
    placeholder: {
      type: String,
      value: '请选择'
    },
    options: {
      type: Array,
      value: []
    },
    value: {
      type: String,
      value: ''
    },
    mode: {
      type: String,
      value: 'selector'
    }
  },

  data: {
    selectedIndex: 0,
    displayText: ''
  },

  lifetimes: {
    attached() {
      this.updateDisplay();
    }
  },

  observers: {
    'value, options': function(value, options) {
      this.updateDisplay();
    }
  },

  methods: {
    updateDisplay() {
      const { value, options, placeholder } = this.properties;
      
      if (value && options.length > 0) {
        const index = options.indexOf(value);
        this.setData({
          selectedIndex: index >= 0 ? index : 0,
          displayText: value
        });
      } else {
        this.setData({
          displayText: placeholder
        });
      }
    },

    onPickerTap() {
      // Trigger the hidden picker
      const picker = this.selectComponent('picker');
      if (picker) {
        picker.open();
      }
    },

    onPickerChange(e) {
      const index = e.detail.value;
      const selectedValue = this.properties.options[index];
      
      this.setData({
        selectedIndex: index,
        displayText: selectedValue
      });

      this.triggerEvent('change', {
        value: selectedValue,
        index: index
      });
    }
  }
});
