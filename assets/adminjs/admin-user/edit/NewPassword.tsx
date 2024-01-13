import React from 'react'
import { EditPropertyProps } from 'adminjs'
import { Input, Label } from '@adminjs/design-system'

const Edit: React.FC<EditPropertyProps> = props => {
  return (
    <div>
      <Label>비밀번호</Label>
      <Input
        style={{ width: '100%' }}
        type={'password'}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          props.onChange('newPassword', e.target.value)
        }
      />
    </div>
  )
}

export default Edit
