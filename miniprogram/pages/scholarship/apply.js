Page({
  data: {
    // 学业成绩
    gpa: '',
    gpaScore: '0.00',

    // 学生工作
    studentWorkOptions: [
      '校学生会主席团成员',
      '院学生会主席团成员',
      '校学生会部长',
      '院学生会部长',
      '班长/团支书'
    ],
    studentWorkIndex: -1,
    studentWork: '',
    studentWorkImage: '',

    // 学科竞赛
    competitions: [],

    // 文体比赛
    sports: [],

    // 荣誉称号
    honors: [],

    // 书院活动
    activities: [],

    // 学术成果
    academicResults: [],

    // 科创项目
    projects: [],

    // 义务献血
    bloodDonation: false,
    bloodDonationImage: '',

    // 分数
    totalScore: '0.00',
    academicScore: '0.00',
    comprehensiveScore: '0.00'
  },

  // 分值配置
  SCORES: {
    competition: {
      '国家级': { '一等': 5, '二等': 4, '三等': 3, '四等': 2 },
      '省市级': { '一等': 4, '二等': 3, '三等': 2, '四等': 1 },
      '校级': { '一等': 1.5, '二等': 1, '三等': 0.5 }
    },
    sports: {
      '国家级': { '一等': 3, '二等': 2, '三等': 1, '集体奖': 0.3 },
      '省市级': { '一等': 2, '二等': 1, '三等': 0.5, '集体奖': 0.2 },
      '校级': { '一等': 1, '二等': 0.5, '三等': 0.3, '集体奖': 0.1 }
    },
    honor: {
      '国家级': 5,
      '省市级': 3,
      '校级': 1,
      '院级': 0.5
    },
    activity: {
      '一等奖': 0.3,
      '二等奖': 0.2,
      '三等奖': 0.1,
      '优秀志愿者': 0.1
    },
    academicResult: {
      'SCI研究性论文/发明专利': { '第一作者': 3, '第二作者': 1.5 },
      'SCI综述性论文': { '第一作者': 2, '第二作者': 1 },
      '其他学术论文': { '第一作者': 1 }
    },
    project: {
      '国家大创': { '负责人': 1, '组员': 0.8 },
      '上海市大创': { '负责人': 0.8, '组员': 0.6 },
      '校级/大夏基金': { '负责人': 0.6, '组员': 0.4 },
      '师范生研习': { '负责人': 0.4, '组员': 0.2 }
    },
    bloodDonation: 0.3
  },

  onLoad() {
    this.updateTotalScore();
  },

  // GPA输入
  onGpaInput(e) {
    const gpa = parseFloat(e.detail.value) || 0;
    const score = (gpa * 20).toFixed(2);
    this.setData({
      gpa: e.detail.value,
      gpaScore: score
    });
    this.updateTotalScore();
  },

  // 学生工作选择
  onStudentWorkChange(e) {
    const index = e.detail.value;
    this.setData({
      studentWorkIndex: index,
      studentWork: this.data.studentWorkOptions[index]
    });
  },

  onStudentWorkImageChange(e) {
    this.setData({
      studentWorkImage: e.detail.url
    });
  },

  onStudentWorkImageRemove() {
    this.setData({
      studentWorkImage: ''
    });
  },

  // 义务献血
  toggleBloodDonation() {
    this.setData({
      bloodDonation: !this.data.bloodDonation
    });
    this.updateTotalScore();
  },

  onBloodDonationImageChange(e) {
    this.setData({
      bloodDonationImage: e.detail.url
    });
  },

  onBloodDonationImageRemove() {
    this.setData({
      bloodDonationImage: ''
    });
  },

  // 添加学科竞赛
  addCompetition() {
    const self = this;
    const levelOptions = ['国家级', '省市级', '校级'];
    
    wx.showActionSheet({
      itemList: levelOptions,
      success(res) {
        const level = levelOptions[res.tapIndex];
        let rankOptions = [];
        
        if (level === '国家级' || level === '省市级') {
          rankOptions = ['一等', '二等', '三等', '四等'];
        } else if (level === '校级') {
          rankOptions = ['一等', '二等', '三等'];
        }

        wx.showActionSheet({
          itemList: rankOptions,
          success(res2) {
            const rank = rankOptions[res2.tapIndex];
            
            wx.showModal({
              title: '添加学科竞赛',
              editable: true,
              placeholderText: '请输入竞赛名称',
              success(res3) {
                if (res3.confirm && res3.content) {
                  const score = self.SCORES.competition[level][rank];
                  const competitions = self.data.competitions;
                  competitions.push({
                    name: res3.content,
                    level: level,
                    rank: rank,
                    score: score.toFixed(1)
                  });
                  self.setData({ competitions });
                  self.updateTotalScore();
                }
              }
            });
          }
        });
      }
    });
  },

  deleteCompetition(e) {
    const index = e.currentTarget.dataset.index;
    const competitions = this.data.competitions;
    competitions.splice(index, 1);
    this.setData({ competitions });
    this.updateTotalScore();
  },

  // 添加文体比赛
  addSports() {
    const self = this;
    const levelOptions = ['国家级', '省市级', '校级'];
    
    wx.showActionSheet({
      itemList: levelOptions,
      success(res) {
        const level = levelOptions[res.tapIndex];
        const rankOptions = ['一等', '二等', '三等', '集体奖'];

        wx.showActionSheet({
          itemList: rankOptions,
          success(res2) {
            const rank = rankOptions[res2.tapIndex];
            
            wx.showModal({
              title: '添加文体比赛',
              editable: true,
              placeholderText: '请输入比赛名称',
              success(res3) {
                if (res3.confirm && res3.content) {
                  const score = self.SCORES.sports[level][rank];
                  const sports = self.data.sports;
                  sports.push({
                    name: res3.content,
                    level: level,
                    rank: rank,
                    score: score.toFixed(1)
                  });
                  self.setData({ sports });
                  self.updateTotalScore();
                }
              }
            });
          }
        });
      }
    });
  },

  deleteSports(e) {
    const index = e.currentTarget.dataset.index;
    const sports = this.data.sports;
    sports.splice(index, 1);
    this.setData({ sports });
    this.updateTotalScore();
  },

  // 添加荣誉称号
  addHonor() {
    const self = this;
    const levelOptions = ['国家级 (+5分)', '省市级 (+3分)', '校级 (+1分)', '院级 (+0.5分)'];
    const levelMap = ['国家级', '省市级', '校级', '院级'];
    
    wx.showActionSheet({
      itemList: levelOptions,
      success(res) {
        const level = levelMap[res.tapIndex];
        
        wx.showModal({
          title: '添加荣誉称号',
          editable: true,
          placeholderText: '请输入荣誉称号名称',
          success(res2) {
            if (res2.confirm && res2.content) {
              const score = self.SCORES.honor[level];
              const honors = self.data.honors;
              honors.push({
                name: res2.content,
                level: level,
                score: score.toFixed(1)
              });
              self.setData({ honors });
              self.updateTotalScore();
            }
          }
        });
      }
    });
  },

  deleteHonor(e) {
    const index = e.currentTarget.dataset.index;
    const honors = this.data.honors;
    honors.splice(index, 1);
    this.setData({ honors });
    this.updateTotalScore();
  },

  // 添加书院活动
  addActivity() {
    const self = this;
    const awardOptions = ['一等奖 (+0.3分)', '二等奖 (+0.2分)', '三等奖 (+0.1分)', '优秀志愿者 (+0.1分)'];
    const awardMap = ['一等奖', '二等奖', '三等奖', '优秀志愿者'];
    
    wx.showActionSheet({
      itemList: awardOptions,
      success(res) {
        const award = awardMap[res.tapIndex];
        
        wx.showModal({
          title: '添加书院活动',
          editable: true,
          placeholderText: '请输入活动名称',
          success(res2) {
            if (res2.confirm && res2.content) {
              const score = self.SCORES.activity[award];
              const activities = self.data.activities;
              activities.push({
                name: res2.content,
                award: award,
                score: score.toFixed(1)
              });
              self.setData({ activities });
              self.updateTotalScore();
            }
          }
        });
      }
    });
  },

  deleteActivity(e) {
    const index = e.currentTarget.dataset.index;
    const activities = this.data.activities;
    activities.splice(index, 1);
    this.setData({ activities });
    this.updateTotalScore();
  },

  // 添加学术成果
  addAcademicResult() {
    const self = this;
    const typeOptions = ['SCI研究性论文/发明专利', 'SCI综述性论文', '其他学术论文'];
    
    wx.showActionSheet({
      itemList: typeOptions,
      success(res) {
        const type = typeOptions[res.tapIndex];
        let rankingOptions = [];
        
        if (type === 'SCI研究性论文/发明专利' || type === 'SCI综述性论文') {
          rankingOptions = ['第一作者', '第二作者'];
        } else {
          rankingOptions = ['第一作者'];
        }

        wx.showActionSheet({
          itemList: rankingOptions,
          success(res2) {
            const ranking = rankingOptions[res2.tapIndex];
            
            wx.showModal({
              title: '添加学术成果',
              editable: true,
              placeholderText: '请输入论文/专利标题',
              success(res3) {
                if (res3.confirm && res3.content) {
                  const score = self.SCORES.academicResult[type][ranking];
                  const academicResults = self.data.academicResults;
                  academicResults.push({
                    title: res3.content,
                    type: type,
                    ranking: ranking,
                    score: score.toFixed(1)
                  });
                  self.setData({ academicResults });
                  self.updateTotalScore();
                }
              }
            });
          }
        });
      }
    });
  },

  deleteAcademicResult(e) {
    const index = e.currentTarget.dataset.index;
    const academicResults = this.data.academicResults;
    academicResults.splice(index, 1);
    this.setData({ academicResults });
    this.updateTotalScore();
  },

  // 添加科创项目
  addProject() {
    const self = this;
    const typeOptions = ['国家大创', '上海市大创', '校级/大夏基金', '师范生研习'];
    
    wx.showActionSheet({
      itemList: typeOptions,
      success(res) {
        const type = typeOptions[res.tapIndex];
        const roleOptions = ['负责人', '组员'];

        wx.showActionSheet({
          itemList: roleOptions,
          success(res2) {
            const role = roleOptions[res2.tapIndex];
            
            wx.showModal({
              title: '添加科创项目',
              editable: true,
              placeholderText: '请输入项目名称',
              success(res3) {
                if (res3.confirm && res3.content) {
                  const score = self.SCORES.project[type][role];
                  const projects = self.data.projects;
                  projects.push({
                    name: res3.content,
                    type: type,
                    role: role,
                    score: score.toFixed(1)
                  });
                  self.setData({ projects });
                  self.updateTotalScore();
                }
              }
            });
          }
        });
      }
    });
  },

  deleteProject(e) {
    const index = e.currentTarget.dataset.index;
    const projects = this.data.projects;
    projects.splice(index, 1);
    this.setData({ projects });
    this.updateTotalScore();
  },

  // 更新总分
  updateTotalScore() {
    // 学业成绩分
    const academicScore = parseFloat(this.data.gpaScore) || 0;

    // 综合表现分
    let comprehensiveScore = 0;

    // 学科竞赛
    this.data.competitions.forEach(item => {
      comprehensiveScore += parseFloat(item.score);
    });

    // 文体比赛
    this.data.sports.forEach(item => {
      comprehensiveScore += parseFloat(item.score);
    });

    // 荣誉称号
    this.data.honors.forEach(item => {
      comprehensiveScore += parseFloat(item.score);
    });

    // 书院活动
    this.data.activities.forEach(item => {
      comprehensiveScore += parseFloat(item.score);
    });

    // 学术成果
    this.data.academicResults.forEach(item => {
      comprehensiveScore += parseFloat(item.score);
    });

    // 科创项目
    this.data.projects.forEach(item => {
      comprehensiveScore += parseFloat(item.score);
    });

    // 义务献血
    if (this.data.bloodDonation) {
      comprehensiveScore += this.SCORES.bloodDonation;
    }

    // 总分
    const totalScore = academicScore + comprehensiveScore;

    this.setData({
      academicScore: academicScore.toFixed(2),
      comprehensiveScore: comprehensiveScore.toFixed(2),
      totalScore: totalScore.toFixed(2)
    });
  },

  // 提交表单
  submitForm() {
    if (!this.data.gpa || parseFloat(this.data.gpa) === 0) {
      wx.showToast({
        title: '请填写GPA成绩',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '提交成功',
      content: `总分：${this.data.totalScore}\n学业成绩：${this.data.academicScore}\n综合表现：${this.data.comprehensiveScore}`,
      showCancel: false,
      success: () => {
        console.log('提交的数据：', this.data);
      }
    });
  }
});
