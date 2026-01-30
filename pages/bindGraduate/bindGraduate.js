// 研究生身份绑定页面逻辑
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 年级选项
    gradeList: ['22级', '23级', '24级', '25级'],
    gradeIndex: -1,
    
    // 专业选项
    majorList: [
      '化学基础',
      '分析化学',
      '有机化学',
      '无机化学',
      '物理化学',
      '高分子化学',
      '材料化学',
      '应用化学'
    ],
    majorIndex: -1,
    
    // 表单数据
    name: '',
    studentId: '',
    password: '',
    
    // 表单验证
    isFormValid: false,
    
    // 聚焦状态
    focusName: false,
    focusGrade: false,
    focusMajor: false,
    focusStudentId: false,
    focusPassword: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('研究生身份绑定页面加载');
  },

  /**
   * 姓名输入
   */
  onNameInput: function (e) {
    this.setData({
      name: e.detail.value
    });
    this.validateForm();
  },

  onNameFocus: function () {
    this.setData({ focusName: true });
  },

  onNameBlur: function () {
    this.setData({ focusName: false });
  },

  /**
   * 年级选择
   */
  onGradeChange: function (e) {
    const index = parseInt(e.detail.value);
    this.setData({
      gradeIndex: index
    });
    this.validateForm();
    console.log('选择年级：', this.data.gradeList[index]);
  },

  /**
   * 专业选择
   */
  onMajorChange: function (e) {
    const index = parseInt(e.detail.value);
    this.setData({
      majorIndex: index
    });
    this.validateForm();
    console.log('选择专业：', this.data.majorList[index]);
  },

  /**
   * 学号输入
   */
  onStudentIdInput: function (e) {
    this.setData({
      studentId: e.detail.value
    });
    this.validateForm();
  },

  onStudentIdFocus: function () {
    this.setData({ focusStudentId: true });
  },

  onStudentIdBlur: function () {
    this.setData({ focusStudentId: false });
  },

  /**
   * 密码输入
   */
  onPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
    this.validateForm();
  },

  onPasswordFocus: function () {
    this.setData({ focusPassword: true });
  },

  onPasswordBlur: function () {
    this.setData({ focusPassword: false });
  },

  /**
   * 表单验证
   */
  validateForm: function () {
    const { name, gradeIndex, majorIndex, studentId, password } = this.data;
    
    // 所有必填项都需要填写
    const isValid = 
      name.trim() !== '' && 
      gradeIndex >= 0 && 
      majorIndex >= 0 &&
      studentId.trim() !== '' && 
      password.trim() !== '';
    
    this.setData({
      isFormValid: isValid
    });
  },

  /**
   * 提交表单
   */
  onSubmit: function () {
    if (!this.data.isFormValid) {
      wx.showToast({
        title: '请完整填写所有信息',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const { name, gradeIndex, majorIndex, studentId, password, gradeList, majorList } = this.data;
    
    // 显示加载提示
    wx.showLoading({
      title: '正在绑定...',
      mask: true
    });

    // 构造提交数据
    const submitData = {
      name: name.trim(),
      grade: gradeList[gradeIndex],
      major: majorList[majorIndex],
      studentId: studentId.trim(),
      password: password,
      type: 'graduate' // 研究生类型
    };

    console.log('提交数据：', submitData);

    // 模拟API请求
    setTimeout(() => {
      wx.hideLoading();
      
      // 这里应该调用实际的API
      // wx.request({
      //   url: 'your-api-endpoint',
      //   method: 'POST',
      //   data: submitData,
      //   success: (res) => {
      //     if (res.data.success) {
      //       wx.showToast({
      //         title: '绑定成功',
      //         icon: 'success',
      //         duration: 2000
      //       });
      //       // 跳转到首页或其他页面
      //       setTimeout(() => {
      //         wx.navigateBack();
      //       }, 2000);
      //     } else {
      //       wx.showToast({
      //         title: res.data.message || '绑定失败',
      //         icon: 'none',
      //         duration: 2000
      //       });
      //     }
      //   },
      //   fail: () => {
      //     wx.showToast({
      //       title: '网络错误，请重试',
      //       icon: 'none',
      //       duration: 2000
      //     });
      //   }
      // });

      // 模拟成功提示
      wx.showToast({
        title: '绑定成功',
        icon: 'success',
        duration: 2000
      });
    }, 1500);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '研究生身份绑定'
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
});
