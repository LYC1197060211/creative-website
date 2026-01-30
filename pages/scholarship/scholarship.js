// pages/scholarship/scholarship.js
Page({
  data: {
    // 学生信息
    studentInfo: {
      name: '',
      grade: '',
      studentId: ''
    },

    // 学业成绩
    academic: {
      credits: '',
      gpa: ''
    },
    academicScore: 0,

    // 学生工作
    workPositions: [
      '无',
      '学生会主席团成员',
      '学生会部长/主要班委/社团社长/党支部支委',
      '学生会副部长/社团副社长',
      '其他班委/其他学生干部',
      '参与志愿服务（待审核认定）'
    ],
    workPositionIndex: 0,
    workScore: 0,
    workProofUploaded: false,

    // 学科竞赛
    competitions: [],
    competitionLevels: ['国家级', '省市级', '校级'],
    competitionGrades: ['一等', '二等', '三等', '四等'],

    // 文体比赛
    sportsCompetitions: [],
    sportsLevels: ['国家级', '省市级', '校级'],
    sportsGrades: ['一等', '二等', '三等', '集体奖'],

    // 荣誉称号
    honors: [],
    honorLevels: ['国家级(5分)', '省市级(3分)', '校级(1分)', '院级(0.5分)'],

    // 书院/学院活动
    campusActivities: [],
    campusActivityTypes: [
      '第二课堂活动-一等奖(0.3)',
      '第二课堂活动-二等奖(0.2)',
      '第二课堂活动-三等奖(0.1)',
      '优秀志愿者(0.1)'
    ],

    // 学术成果
    academicAchievements: [],
    achievementTypes: [
      'SCI研究性论文/发明专利',
      'SCI综述性论文',
      '其他学术论文'
    ],
    achievementAuthors: ['第一作者', '第二作者'],

    // 科创项目
    researchProjects: [],
    projectTypes: [
      '国家级项目结项',
      '上海市项目结项',
      '校级项目/大夏科研基金',
      '师范生教育研习'
    ],
    projectRoles: ['负责人', '组员'],

    // 其他
    others: [],
    otherTypes: ['义务献血(0.3)'],

    // 总分
    qualityScore: 0,
    totalScore: 0
  },

  onLoad() {
    this.calculateTotalScore();
  },

  // 学生信息输入
  onNameInput(e) {
    this.setData({
      'studentInfo.name': e.detail.value
    });
  },

  onGradeInput(e) {
    this.setData({
      'studentInfo.grade': e.detail.value
    });
  },

  onStudentIdInput(e) {
    this.setData({
      'studentInfo.studentId': e.detail.value
    });
  },

  // 学业成绩输入
  onCreditsInput(e) {
    this.setData({
      'academic.credits': e.detail.value
    });
  },

  onGpaInput(e) {
    const gpa = parseFloat(e.detail.value) || 0;
    this.setData({
      'academic.gpa': e.detail.value,
      academicScore: (gpa * 20).toFixed(2)
    });
    this.calculateTotalScore();
  },

  // 学生工作职务选择
  onWorkPositionChange(e) {
    const index = parseInt(e.detail.value);
    const scores = [0, 1.0, 0.8, 0.6, 0.5, 0.5]; // 志愿服务默认0.5，实际需审核
    
    this.setData({
      workPositionIndex: index,
      workScore: scores[index]
    });
    this.calculateTotalScore();
  },

  uploadWorkProof() {
    // 模拟上传
    wx.showToast({
      title: '上传成功',
      icon: 'success'
    });
    this.setData({
      workProofUploaded: true
    });
  },

  // 学科竞赛/创新创业
  addCompetition() {
    const competitions = this.data.competitions;
    competitions.push({
      levelIndex: 0,
      gradeIndex: 0,
      score: 5
    });
    this.setData({ competitions });
    this.calculateQualityScore();
  },

  onCompetitionLevelChange(e) {
    const index = e.currentTarget.dataset.index;
    const levelIndex = parseInt(e.detail.value);
    const competitions = this.data.competitions;
    competitions[index].levelIndex = levelIndex;
    competitions[index].score = this.calculateCompetitionScore(levelIndex, competitions[index].gradeIndex);
    this.setData({ competitions });
    this.calculateQualityScore();
  },

  onCompetitionGradeChange(e) {
    const index = e.currentTarget.dataset.index;
    const gradeIndex = parseInt(e.detail.value);
    const competitions = this.data.competitions;
    competitions[index].gradeIndex = gradeIndex;
    competitions[index].score = this.calculateCompetitionScore(competitions[index].levelIndex, gradeIndex);
    this.setData({ competitions });
    this.calculateQualityScore();
  },

  calculateCompetitionScore(levelIndex, gradeIndex) {
    const scoreTable = [
      [5, 4, 3, 2],    // 国家级
      [4, 3, 2, 1],    // 省市级
      [1.5, 1, 0.5, 0] // 校级
    ];
    return scoreTable[levelIndex][gradeIndex];
  },

  deleteCompetition(e) {
    const index = e.currentTarget.dataset.index;
    const competitions = this.data.competitions;
    competitions.splice(index, 1);
    this.setData({ competitions });
    this.calculateQualityScore();
  },

  // 文体比赛
  addSports() {
    const sportsCompetitions = this.data.sportsCompetitions;
    sportsCompetitions.push({
      levelIndex: 0,
      gradeIndex: 0,
      score: 3
    });
    this.setData({ sportsCompetitions });
    this.calculateQualityScore();
  },

  onSportsLevelChange(e) {
    const index = e.currentTarget.dataset.index;
    const levelIndex = parseInt(e.detail.value);
    const sportsCompetitions = this.data.sportsCompetitions;
    sportsCompetitions[index].levelIndex = levelIndex;
    sportsCompetitions[index].score = this.calculateSportsScore(levelIndex, sportsCompetitions[index].gradeIndex);
    this.setData({ sportsCompetitions });
    this.calculateQualityScore();
  },

  onSportsGradeChange(e) {
    const index = e.currentTarget.dataset.index;
    const gradeIndex = parseInt(e.detail.value);
    const sportsCompetitions = this.data.sportsCompetitions;
    sportsCompetitions[index].gradeIndex = gradeIndex;
    sportsCompetitions[index].score = this.calculateSportsScore(sportsCompetitions[index].levelIndex, gradeIndex);
    this.setData({ sportsCompetitions });
    this.calculateQualityScore();
  },

  calculateSportsScore(levelIndex, gradeIndex) {
    const scoreTable = [
      [3, 2, 1, 0.3],   // 国家级
      [2, 1, 0.5, 0.2], // 省市级
      [1, 0.5, 0.3, 0.1] // 校级
    ];
    return scoreTable[levelIndex][gradeIndex];
  },

  deleteSports(e) {
    const index = e.currentTarget.dataset.index;
    const sportsCompetitions = this.data.sportsCompetitions;
    sportsCompetitions.splice(index, 1);
    this.setData({ sportsCompetitions });
    this.calculateQualityScore();
  },

  // 荣誉称号
  addHonor() {
    const honors = this.data.honors;
    honors.push({
      levelIndex: 0,
      score: 5
    });
    this.setData({ honors });
    this.calculateQualityScore();
  },

  onHonorLevelChange(e) {
    const index = e.currentTarget.dataset.index;
    const levelIndex = parseInt(e.detail.value);
    const honors = this.data.honors;
    const scores = [5, 3, 1, 0.5];
    honors[index].levelIndex = levelIndex;
    honors[index].score = scores[levelIndex];
    this.setData({ honors });
    this.calculateQualityScore();
  },

  deleteHonor(e) {
    const index = e.currentTarget.dataset.index;
    const honors = this.data.honors;
    honors.splice(index, 1);
    this.setData({ honors });
    this.calculateQualityScore();
  },

  // 书院/学院活动
  addCampusActivity() {
    const campusActivities = this.data.campusActivities;
    campusActivities.push({
      typeIndex: 0,
      score: 0.3
    });
    this.setData({ campusActivities });
    this.calculateQualityScore();
  },

  onCampusActivityChange(e) {
    const index = e.currentTarget.dataset.index;
    const typeIndex = parseInt(e.detail.value);
    const campusActivities = this.data.campusActivities;
    const scores = [0.3, 0.2, 0.1, 0.1];
    campusActivities[index].typeIndex = typeIndex;
    campusActivities[index].score = scores[typeIndex];
    this.setData({ campusActivities });
    this.calculateQualityScore();
  },

  deleteCampusActivity(e) {
    const index = e.currentTarget.dataset.index;
    const campusActivities = this.data.campusActivities;
    campusActivities.splice(index, 1);
    this.setData({ campusActivities });
    this.calculateQualityScore();
  },

  // 学术成果
  addAcademicAchievement() {
    const academicAchievements = this.data.academicAchievements;
    academicAchievements.push({
      typeIndex: 0,
      authorIndex: 0,
      score: 3
    });
    this.setData({ academicAchievements });
    this.calculateQualityScore();
  },

  onAchievementTypeChange(e) {
    const index = e.currentTarget.dataset.index;
    const typeIndex = parseInt(e.detail.value);
    const academicAchievements = this.data.academicAchievements;
    academicAchievements[index].typeIndex = typeIndex;
    academicAchievements[index].score = this.calculateAchievementScore(typeIndex, academicAchievements[index].authorIndex);
    this.setData({ academicAchievements });
    this.calculateQualityScore();
  },

  onAchievementAuthorChange(e) {
    const index = e.currentTarget.dataset.index;
    const authorIndex = parseInt(e.detail.value);
    const academicAchievements = this.data.academicAchievements;
    academicAchievements[index].authorIndex = authorIndex;
    academicAchievements[index].score = this.calculateAchievementScore(academicAchievements[index].typeIndex, authorIndex);
    this.setData({ academicAchievements });
    this.calculateQualityScore();
  },

  calculateAchievementScore(typeIndex, authorIndex) {
    const scoreTable = [
      [3, 1.5],  // SCI研究性论文/发明专利
      [2, 1],    // SCI综述性论文
      [1, 0]     // 其他学术论文（只有第一作者）
    ];
    return scoreTable[typeIndex][authorIndex];
  },

  deleteAcademicAchievement(e) {
    const index = e.currentTarget.dataset.index;
    const academicAchievements = this.data.academicAchievements;
    academicAchievements.splice(index, 1);
    this.setData({ academicAchievements });
    this.calculateQualityScore();
  },

  // 科创项目
  addResearchProject() {
    const researchProjects = this.data.researchProjects;
    researchProjects.push({
      typeIndex: 0,
      roleIndex: 0,
      score: 1
    });
    this.setData({ researchProjects });
    this.calculateQualityScore();
  },

  onProjectTypeChange(e) {
    const index = e.currentTarget.dataset.index;
    const typeIndex = parseInt(e.detail.value);
    const researchProjects = this.data.researchProjects;
    researchProjects[index].typeIndex = typeIndex;
    researchProjects[index].score = this.calculateProjectScore(typeIndex, researchProjects[index].roleIndex);
    this.setData({ researchProjects });
    this.calculateQualityScore();
  },

  onProjectRoleChange(e) {
    const index = e.currentTarget.dataset.index;
    const roleIndex = parseInt(e.detail.value);
    const researchProjects = this.data.researchProjects;
    researchProjects[index].roleIndex = roleIndex;
    researchProjects[index].score = this.calculateProjectScore(researchProjects[index].typeIndex, roleIndex);
    this.setData({ researchProjects });
    this.calculateQualityScore();
  },

  calculateProjectScore(typeIndex, roleIndex) {
    const scoreTable = [
      [1, 0.8],    // 国家级
      [0.8, 0.6],  // 上海市级
      [0.6, 0.4],  // 校级/大夏基金
      [0.4, 0.2]   // 师范生教育研习
    ];
    return scoreTable[typeIndex][roleIndex];
  },

  deleteResearchProject(e) {
    const index = e.currentTarget.dataset.index;
    const researchProjects = this.data.researchProjects;
    researchProjects.splice(index, 1);
    this.setData({ researchProjects });
    this.calculateQualityScore();
  },

  // 其他
  addOther() {
    const others = this.data.others;
    others.push({
      typeIndex: 0,
      score: 0.3
    });
    this.setData({ others });
    this.calculateQualityScore();
  },

  onOtherTypeChange(e) {
    const index = e.currentTarget.dataset.index;
    const typeIndex = parseInt(e.detail.value);
    const others = this.data.others;
    others[index].typeIndex = typeIndex;
    others[index].score = 0.3; // 义务献血固定0.3分
    this.setData({ others });
    this.calculateQualityScore();
  },

  deleteOther(e) {
    const index = e.currentTarget.dataset.index;
    const others = this.data.others;
    others.splice(index, 1);
    this.setData({ others });
    this.calculateQualityScore();
  },

  // 计算素质类加分总分
  calculateQualityScore() {
    let total = 0;

    // 学科竞赛
    this.data.competitions.forEach(item => {
      total += item.score;
    });

    // 文体比赛
    this.data.sportsCompetitions.forEach(item => {
      total += item.score;
    });

    // 荣誉称号
    this.data.honors.forEach(item => {
      total += item.score;
    });

    // 书院/学院活动
    this.data.campusActivities.forEach(item => {
      total += item.score;
    });

    // 学术成果
    this.data.academicAchievements.forEach(item => {
      total += item.score;
    });

    // 科创项目
    this.data.researchProjects.forEach(item => {
      total += item.score;
    });

    // 其他
    this.data.others.forEach(item => {
      total += item.score;
    });

    this.setData({
      qualityScore: total.toFixed(2)
    });

    this.calculateTotalScore();
  },

  // 计算总分
  calculateTotalScore() {
    const academicScore = parseFloat(this.data.academicScore) || 0;
    const workScore = parseFloat(this.data.workScore) || 0;
    const qualityScore = parseFloat(this.data.qualityScore) || 0;
    
    const total = academicScore + workScore + qualityScore;
    
    this.setData({
      totalScore: total.toFixed(2)
    });
  },

  // 保存草稿
  saveDraft() {
    wx.showToast({
      title: '草稿已保存',
      icon: 'success'
    });
    // 实际应用中应保存到本地存储或服务器
  },

  // 提交申请
  submitApplication() {
    // 验证必填项
    if (!this.data.studentInfo.name || !this.data.studentInfo.grade || !this.data.studentInfo.studentId) {
      wx.showToast({
        title: '请完善学生信息',
        icon: 'none'
      });
      return;
    }

    if (!this.data.academic.gpa) {
      wx.showToast({
        title: '请输入GPA',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认提交',
      content: `综合评定成绩：${this.data.totalScore}分\n确认提交申请？`,
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          });
          // 实际应用中应提交到服务器
        }
      }
    });
  }
});
