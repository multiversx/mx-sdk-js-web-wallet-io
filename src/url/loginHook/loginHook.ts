import { useGetLoginHookData } from './helpers';
import { HookValidationOutcome } from '../HookValidationOutcome';
import { HookStateEnum } from '../types';

export const LoginHook = () => {
  const getLoginHookData = useGetLoginHookData();
  const { address } = useGetAccount();
  const logout = useLogout('LoginHook');
  const dispatch = useDispatch();
  const [validUrl, setValidUrl] = useState<HookStateEnum>(
    HookStateEnum.pending
  );

  const loginHook = getLoginHookData();

  useEffect(() => {
    // Prevent re-login
    if (address) {
      logout({
        noRedirect: true // allow login hook to be validated without redirecting
      });
      return;
    }

    if (!loginHook) {
      return setValidUrl(HookStateEnum.invalid);
    }

    dispatch(
      setHook({
        type: HooksEnum.login,
        hookUrl: loginHook.hookUrl,
        callbackUrl: loginHook.callbackUrl,
        loginToken: loginHook.token
      })
    );

    setValidUrl(HookStateEnum.valid);
  }, [address]);

  return (
    <HookValidationOutcome
      hook={HooksEnum.login}
      callbackUrl={loginHook?.callbackUrl}
      validUrl={validUrl}
    />
  );
};
