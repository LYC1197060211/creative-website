'use client'

import React, { useState } from 'react'
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Modal,
  Badge,
  Spinner
} from '@/components/ui'

export default function ComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showSpinner, setShowSpinner] = useState(false)

  const handleShowSpinner = () => {
    setShowSpinner(true)
    setTimeout(() => setShowSpinner(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            UI 组件库演示
          </h1>
          <p className="text-lg text-gray-600">
            创意管理系统的基础UI组件展示
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Button 组件演示 */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Button 按钮组件</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">主要按钮</Button>
                <Button variant="secondary">次要按钮</Button>
                <Button variant="secondary">轮廓按钮</Button>
                <Button variant="ghost">幽灵按钮</Button>
                <Button variant="danger">危险按钮</Button>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="sm">小按钮</Button>
                <Button size="md">中按钮</Button>
                <Button size="lg">大按钮</Button>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button loading>加载中...</Button>
                <Button disabled>禁用按钮</Button>
              </div>
            </CardContent>
          </Card>

          {/* Input 组件演示 */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Input 输入框组件</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="用户名"
                placeholder="请输入用户名"
                helperText="用户名长度为3-20个字符"
              />

              <Input
                label="密码"
                type="password"
                placeholder="请输入密码"
              />

              <Input
                label="邮箱"
                type="email"
                placeholder="请输入邮箱"
                error="请输入有效的邮箱地址"
              />

              <Input
                label="禁用输入框"
                placeholder="禁用状态"
                disabled
              />
            </CardContent>
          </Card>

          {/* Badge 组件演示 */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Badge 标签组件</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">默认</Badge>
                <Badge variant="primary">主要</Badge>
                <Badge variant="secondary">次要</Badge>
                <Badge variant="success">成功</Badge>
                <Badge variant="warning">警告</Badge>
                <Badge variant="error">错误</Badge>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">尺寸：</span>
                <Badge size="sm">小标签</Badge>
                <Badge size="md">中标签</Badge>
                <Badge size="lg">大标签</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Spinner 组件演示 */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Spinner 加载动画</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
              </div>

              <div className="flex items-center gap-4">
                <Spinner color="primary" />
                <Spinner color="secondary" />
                <div className="bg-gray-800 p-3 rounded">
                  <Spinner color="white" />
                </div>
              </div>

              <Button onClick={handleShowSpinner}>
                显示2秒加载动画
              </Button>

              {showSpinner && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Spinner />
                  <span>正在处理...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modal 组件演示 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h2 className="text-xl font-semibold">Modal 模态框组件</h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setIsModalOpen(true)}>
                  打开模态框
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 统计卡片演示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">创意总数</p>
                  <p className="text-3xl font-bold text-blue-600">42</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">已完成</p>
                  <p className="text-3xl font-bold text-green-600">28</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">进行中</p>
                  <p className="text-3xl font-bold text-yellow-600">14</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="模态框示例"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            这是一个模态框示例，展示了我们的模态框组件的基本功能。
          </p>
          <Input
            label="输入框演示"
            placeholder="在模态框中的输入框"
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              确认
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}