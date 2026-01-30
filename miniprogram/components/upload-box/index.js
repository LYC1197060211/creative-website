Component({
  properties: {
    placeholder: {
      type: String,
      value: '点击上传图片'
    },
    imageUrl: {
      type: String,
      value: ''
    },
    maxSize: {
      type: Number,
      value: 10 * 1024 * 1024 // 10MB
    }
  },

  data: {},

  methods: {
    chooseImage() {
      const self = this;
      
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          const tempFilePath = res.tempFilePaths[0];
          
          // Check file size
          wx.getFileInfo({
            filePath: tempFilePath,
            success(fileInfo) {
              if (fileInfo.size > self.properties.maxSize) {
                wx.showToast({
                  title: '图片过大，请选择小于10MB的图片',
                  icon: 'none'
                });
                return;
              }

              self.triggerEvent('change', {
                url: tempFilePath
              });
            }
          });
        },
        fail(err) {
          console.error('Choose image failed:', err);
          wx.showToast({
            title: '选择图片失败',
            icon: 'none'
          });
        }
      });
    },

    removeImage() {
      this.triggerEvent('remove');
    }
  }
});
