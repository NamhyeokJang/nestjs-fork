import React from 'react'
import { BasePropertyProps } from 'adminjs'
import { Label } from '@adminjs/design-system'

const Show: React.FC<BasePropertyProps> = props => {
  const key = props.record!.params.key

  return (
    <div style={{ marginBottom: 20 }}>
      {props.where === 'show' && <Label color={'#898A9A'}>키</Label>}
      <p>
        {' '}
        {key.slice(0, 5)}
        {key.slice(5, 15).replace(/[a-zA-Z0-9]/g, '*')}
      </p>
    </div>
  )
}

export default Show
