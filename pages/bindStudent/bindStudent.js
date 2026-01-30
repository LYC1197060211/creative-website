// pages/bindStudent/bindStudent.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 年级列表
    gradeList: ['22级', '23级', '24级', '25级'],
    gradeIndex: -1, // 当前选中的年级索引，-1表示未选择
    
    // 表单数据
    name: '',
    studentId: '',
    password: '',
    
    // 聚焦状态
    focusedField: '',
    
    // 是否可以提交
    canSubmit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('页面加载:', options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 可以在这里设置页面标题
    wx.setNavigationBarTitle({
      title: '学生身份绑定'
    });
  },

  /**
   * 年级选择器变更事件
   */
  onGradeChange(e) {
    const index = parseInt(e.detail.value);
    console.log('选择年级:', this.data.gradeList[index]);
    
    this.setData({
      gradeIndex: index
    }, () => {
      this.checkCanSubmit();
    });
  },

  /**
   * 姓名输入事件
   */
  onNameInput(e) {
    this.setData({
      name: e.detail.value
    }, () => {
      this.checkCanSubmit();
    });
  },

  /**
   * 学号输入事件
   */
  onStudentIdInput(e) {
    this.setData({
      studentId: e.detail.value
    }, () => {
      this.checkCanSubmit();
    });
  },

  /**
   * 密码输入事件
   */
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    }, () => {
      this.checkCanSubmit();
    });
  },

  /**
   * 输入框聚焦事件
   */
  onFocus(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      focusedField: field
    });
  },

  /**
   * 输入框失焦事件
   */
  onBlur(e) {
    this.setData({
      focusedField: ''
    });
  },

  /**
   * 检查是否可以提交
   */
  checkCanSubmit() {
    const { name, gradeIndex, studentId, password } = this.data;
    const canSubmit = name.trim() !== '' && 
                     gradeIndex >= 0 && 
                     studentId.trim() !== '' && 
                     password.trim() !== '';
    
    this.setData({
      canSubmit
    });
  },

  /**
   * 表单验证
   */
  validateForm() {
    const { name, gradeIndex, studentId, password } = this.data;
    
    if (!name || name.trim() === '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    
    if (gradeIndex < 0) {
      wx.showToast({
        title: '请选择年级',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    
    if (!studentId || studentId.trim() === '') {
      wx.showToast({
        title: '请输入学号',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    
    // 学号格式验证（可根据实际需求调整）
    if (studentId.length < 6) {
      wx.showToast({
        title: '学号格式不正确',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    
    if (!password || password.trim() === '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    
    if (password.length < 6) {
      wx.showToast({
        title: '密码长度至少6位',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    
    return true;
  },

  /**
   * 提交绑定
   */
  onSubmit() {
    if (!this.data.canSubmit) {
      return;
    }
    
    // 表单验证
    if (!this.validateForm()) {
      return;
    }
    
    const { name, gradeIndex, gradeList, studentId, password } = this.data;
    const selectedGrade = gradeList[gradeIndex];
    
    console.log('提交表单:', {
      name,
      grade: selectedGrade,
      studentId,
      password: '******'
    });
    
    // 显示加载提示
    wx.showLoading({
      title: '绑定中...',
      mask: true
    });
    
    // 模拟API调用
    setTimeout(() => {
      wx.hideLoading();
      
      // 这里应该调用实际的API
      // wx.request({
      //   url: 'your-api-url',
      //   method: 'POST',
      //   data: {
      //     name,
      //     grade: selectedGrade,
      //     studentId,
      //     password
      //   },
      //   success: (res) => {
      //     // 处理成功情况
      //   },
      //   fail: (err) => {
      //     // 处理失败情况
      //   }
      // });
      
      // 模拟成功
      wx.showToast({
        title: '绑定成功',
        icon: 'success',
        duration: 2000
      });
      
      // 2秒后返回上一页或跳转到主页
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 2000);
    }, 1500);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示时的逻辑
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // 页面隐藏时的逻辑
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 页面卸载时的逻辑
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 上拉触底
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '学生身份绑定',
      path: '/pages/bindStudent/bindStudent'
    };
  }
});
