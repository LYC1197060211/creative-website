import React from 'react'

export interface AvatarProps {
  children?: React.ReactNode
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  fallback?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  children,
  src,
  alt,
  size = 'md',
  className = '',
  fallback,
  ...props
}) => {
  const [imageError, setImageError] = React.useState(false)
  const [showFallback, setShowFallback] = React.useState(false)

  React.useEffect(() => {
    setImageError(false)
    setShowFallback(false)
  }, [src])

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg'
  }

  const handleError = () => {
    setImageError(true)
    if (fallback) {
      setShowFallback(true)
    }
  }

  const getInitials = (text: string) => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  return (
    <div
      className={`
        relative inline-flex items-center justify-center
        rounded-full bg-gray-100 text-gray-600
        overflow-hidden
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {src && !imageError && (
        <img
          src={src}
          alt={alt}
          onError={handleError}
          className="w-full h-full object-cover"
        />
      )}

      {showFallback && fallback && (
        <span className="font-medium">
          {getInitials(fallback)}
        </span>
      )}

      {(!src || imageError) && !showFallback && children}
    </div>
  )
}

export type { AvatarProps }