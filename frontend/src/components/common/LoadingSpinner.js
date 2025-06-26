import {Spinner} from 'react-bootstrap';

export const LoadingSpinner = ({size='lg', text='Loading...'}) => (
    <div className='d-flex flex-column justify-content-center align-items-center p-4'>
        <Spinner animation='border' size={size} />
        {text && <small className='mt-2 text-muted'>{text}</small>}
    </div>
)


