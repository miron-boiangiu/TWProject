import { UserRoleEnum } from "@infrastructure/apis/client";
import { useOwnUserHasRole } from "@infrastructure/hooks/useOwnUser";
import { AppIntlProvider } from "@presentation/components/ui/AppIntlProvider";
import { ToastNotifier } from "@presentation/components/ui/ToastNotifier";
import { HomePage } from "@presentation/pages/HomePage";
import { LoginPage } from "@presentation/pages/LoginPage";
import { UserFilesPage } from "@presentation/pages/UserFilesPage";
import { UsersPage } from "@presentation/pages/UsersPage";
import { TorrentPage } from "@presentation/pages/TorrentPage";
import { Route, Routes } from "react-router-dom";
import { AppRoute } from "routes";
import { AddCommentPage } from "@presentation/pages/AddCommentPage";
import { RegisterPage } from "@presentation/pages/RegisterPage";
import { FeedbackPage } from "@presentation/pages/AddFeedbackPage";
import { BrowseFeedbackPage } from "@presentation/pages/BrowseFeedbackPage";
import { InvitationsPage } from "@presentation/pages/InvitationsPage";
import { AboutUsPage } from "@presentation/pages/AboutUsPage";
import { ContactUsPage } from "@presentation/pages/ContactUsPage";

export function App() {
  const isAdmin = useOwnUserHasRole(UserRoleEnum.Admin);

  return <AppIntlProvider> {/* AppIntlProvider provides the functions to search the text after the provides string ids. */}
      <ToastNotifier />
      {/* This adds the routes and route mappings on the various components. */}
      <Routes>
        <Route path={AppRoute.Index} element={<HomePage />} /> {/* Add a new route with a element as the page. */}
        <Route path={AppRoute.Login} element={<LoginPage />} />
        <Route path={AppRoute.Register} element={<RegisterPage />} />
        {isAdmin && <Route path={AppRoute.Users} element={<UsersPage />} />} {/* If the user doesn't have the right role this route shouldn't be used. */}
        {<Route path={AppRoute.UserFiles} element={<UserFilesPage />} />}
        {<Route path={AppRoute.Torrent} element={<TorrentPage />} />}
        {<Route path={AppRoute.AddComment} element={<AddCommentPage />} />}
        {<Route path={AppRoute.AddFeedback} element={<FeedbackPage />} />}
        {<Route path={AppRoute.AboutUs} element={<AboutUsPage />} />}
        {<Route path={AppRoute.ContactUs} element={<ContactUsPage />} />}
        {isAdmin && <Route path={AppRoute.BrowseFeedback} element={<BrowseFeedbackPage />} />}
        {isAdmin && <Route path={AppRoute.Invitations} element={<InvitationsPage />} />}
      </Routes>
    </AppIntlProvider>
}
