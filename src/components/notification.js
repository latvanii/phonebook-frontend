import React from 'react'

const Notification = ({ message, isError}) => {
    if (message === null) {
        return null
    }
    let className='notification'

    if (isError){
        className='error'
    }

    return (
        <div className={className}>
            {message}
        </div>
    )
}

export default Notification