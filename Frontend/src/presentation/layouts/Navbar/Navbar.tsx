import { useCallback } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import { AppRoute } from 'routes';
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from '@application/store';
import {IconButton} from '@mui/material';
import { resetProfile } from '@application/state-slices';
import { useAppRouter } from '@infrastructure/hooks/useAppRouter';
import { NavbarLanguageSelector } from '@presentation/components/ui/NavbarLanguageSelector/NavbarLanguageSelector';
import { useOwnUserHasRole } from '@infrastructure/hooks/useOwnUser';
import { UserRoleEnum } from '@infrastructure/apis/client';
import {
    Stack,
} from "@mui/material";

/**
 * This is the navigation menu that will stay at the top of the page.
 */
interface NavBarInterface {
  viewingTorrent?: boolean
  text?: string
};

export const Navbar = ({viewingTorrent, text}: NavBarInterface) => {
  const {formatMessage} = useIntl();
  const {loggedIn} = useAppSelector(x => x.profileReducer);
  const isAdmin = useOwnUserHasRole(UserRoleEnum.Admin);
  const dispatch = useAppDispatch();
  const {redirectToHome} = useAppRouter();
  const logout = useCallback(() => {
    dispatch(resetProfile());
    redirectToHome();
  }, [dispatch, redirectToHome]);

  return <>
    <div className="w-full top-0 z-50 fixed">
      <AppBar>
        <Toolbar>
          <div className="w-full grid grid-cols-12 gap-y-5 gap-x-10 justify-center items-center">
            <div className="col-span-1">
              <Link
                  to={AppRoute.Index}> {/* Add a button to redirect to the home page. */}
                <IconButton>
                  <HomeIcon style={{color: 'white'}} fontSize='large'/>
                </IconButton>
              </Link>
            </div>
            {<div className="col-span-1">
                <Button color="inherit">
                  <Link style={{color: 'white'}} to={AppRoute.AboutUs}>
                    About us
                  </Link>
                </Button>
            </div>}
            {<div className="col-span-1">
                <Button color="inherit">
                  <Link style={{color: 'white'}} to={AppRoute.ContactUs}>
                    Contact
                  </Link>
                </Button>
            </div>}
            {isAdmin && <> { /*If the user is logged in and it is an admin they can have new menu items shown.*/ }
              <div className="col-span-1">
                <Button color="inherit">
                  <Link style={{color: 'white'}} to={AppRoute.Users}>
                    {formatMessage({id: "globals.users"})}
                  </Link>
                </Button>
              </div></>
            }
            {loggedIn && <div className="col-span-1">
                <Button color="inherit">
                  <Link style={{color: 'white'}} to={AppRoute.UserFiles}>
                    {formatMessage({id: "globals.files"})}
                  </Link>
                </Button>
            </div>}
            {loggedIn && isAdmin && <div className="col-span-1">
                <Button color="inherit">
                  <Link style={{color: 'white'}} to={AppRoute.Invitations}>
                    Invitations
                  </Link>
                </Button>
            </div>}
            {loggedIn && isAdmin && <div className="col-span-1">
                <Button color="inherit">
                  <Link style={{color: 'white'}} to={AppRoute.BrowseFeedback}>
                    Browse Feedback
                  </Link>
                </Button>
            </div>}

            {viewingTorrent && <>
              <div className="col-span-1">
                <Button color="inherit">
                  {text}
                </Button>
              </div>
            </>}
            
            
            { !isAdmin && loggedIn && <div className="-col-end-3 col-span-1">
                <Button color="inherit">
                  <Link style={{color: 'white'}} to={AppRoute.AddFeedback}>
                    Feedback
                  </Link>
                </Button>
              </div>
            }

            {loggedIn && <div className="-col-end-2 col-span-1">
              <NavbarLanguageSelector/>
            </div>}

            {!loggedIn && <div className="-col-end-3 col-span-1">
              <NavbarLanguageSelector/>
            </div>}
            
            {!loggedIn && <div className="-col-end-2 col-span-1">
                <Button color="inherit"><Link style={{color: 'white'}} to={AppRoute.Register}>
                  REGISTER
                </Link></Button>
            </div>}

            <div className="-col-end-1 col-span-1">
              {!loggedIn && <Button color="inherit">  {/* If the user is not logged in show a button that redirects to the login page. */}
                <Link style={{color: 'white'}} to={AppRoute.Login}>
                  LOGIN
                </Link>
              </Button>}

              {loggedIn && <Button onClick={logout} color="inherit"> {/* Otherwise show the logout button. */}
                {formatMessage({id: "globals.logout"})}
              </Button>}

            </div>

          </div>
        </Toolbar>
      </AppBar>
    </div>
    <div className="w-full top-0 z-49">
      <div className="min-h-20"/>
    </div>
  </>
}