
interface ErrorViewProps {
  error: Error;
}

const ErrorView: React.FC<ErrorViewProps> = ({
  error
}) => {
  return (
    <div>
      <p>
        <span className='text-red-600'>An error ocurred:</span>
      </p>
      <p>
        <span className='text-red-800'>{error.message}</span>
      </p>
      <pre className='text-sm overflow-scroll'>
        {error.stack}
      </pre>
    </div>
  );
}

export default ErrorView;
