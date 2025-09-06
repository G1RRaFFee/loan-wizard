import { ReactNode } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

// Лёгкая модалка в стиле Bootstrap без JS-зависимостей
export default function Modal({ open, onClose, children, title }: Props) {
  if (!open) return null
  return (
    <div className='modal show d-block' tabIndex={-1} role='dialog' style={{ background: 'rgba(0,0,0,.5)' }}>
      <div className='modal-dialog' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{title}</h5>
            <button type='button' className='btn-close' aria-label='Close' onClick={onClose}></button>
          </div>
          <div className='modal-body'>{children}</div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-primary' onClick={onClose}>
              Ок
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
