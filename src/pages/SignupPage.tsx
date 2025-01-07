import {SignupForm} from '../components/auth/SignupForm';
import Header from '../components/Header';

export default function SignupPage() {
  return (
    <div>
      <Header />
      <div style={{marginTop: '150px'}}>
        <SignupForm />
      </div>
    </div>
  );
}