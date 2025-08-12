import React, {lazy} from "react";
import {Route, Routes} from "react-router-dom";
import {PermissionsProvider} from "./context/PermissionProvider.jsx";
import {useAuth} from "./context/AuthProvider.jsx";
import {ToastContainer, Zoom} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from "./pages/Dashboard";
import AuthLayout from "./components/Layout/AuthLayout";
import GuestLayout from "./components/Layout/GuestLayout";
import Login from "./pages/auth/Login";

import MeetingLayout from "./pages/meetings/MeetingLayout.jsx";
import MeetingShowLayout from "./pages/meetings/meetings/MeetingShowLayout.jsx";
import MyMeetingShowLayout from "./pages/meetings/mymeetings/MeetingShowLayout.jsx";
import FollowedMeetingShowLayout from "./pages/meetings/followedmeetings/MeetingShowLayout.jsx";

import EventLayout from "./pages/events/EventLayout.jsx";
import EventShowLayout from "./pages/events/events/EventShowLayout.jsx";
import EventSessionLayout from "./pages/events/events/sessions/EventSessionLayout.jsx";
import FollowedEventShowLayout from "./pages/events/followedevents/EventShowLayout.jsx";
import MyEventShowLayout from "./pages/events/myevents/EventShowLayout.jsx";
import MyEventSessionLayout from "./pages/events/myevents/sessions/EventSessionLayout.jsx";

import UserLayout from "./pages/users/UserLayout.jsx";
import NotFound from "./pages/NotFound.jsx";
import UserShowLayout from "./pages/users/UserShowLayout.jsx";

import MasterLayout from "./pages/master/MasterLayout.jsx";

import ProfileLayout from "./pages/profile/ProfileLayout.jsx";
import PrintLayout from "./pages/events/PrintLayout.jsx";

import LoginSso from "./pages/LoginSso.jsx";

import GuestBookLayout from "./pages/guestbook/GuestBookLayout.jsx";

const MeetingMenu = lazy(() => import('./pages/meetings/MeetingMenu.jsx'));
const MeetingIndex = lazy(() => import('./pages/meetings/meetings/MeetingIndex.jsx'));
const MeetingShow = lazy(() => import('./pages/meetings/meetings/MeetingShow.jsx'));
const MeetingParticipant = lazy(() => import('./pages/meetings/meetings/participants/MeetingParticipant.jsx'));
const MeetingDocumentation = lazy(() => import('./pages/meetings/meetings/documentations/MeetingDocumentation.jsx'));

const MyMeetingIndex = lazy(() => import('./pages/meetings/mymeetings/MeetingIndex.jsx'));
const MyMeetingShow = lazy(() => import('./pages/meetings/mymeetings/MeetingShow.jsx'));
const MyMeetingParticipant = lazy(() => import('./pages/meetings/mymeetings/participants/MeetingParticipant.jsx'));
const MyMeetingDocumentation = lazy(() => import('./pages/meetings/mymeetings/documentations/MeetingDocumentation.jsx'));

const FollowedMeetingIndex = lazy(() => import('./pages/meetings/followedmeetings/MeetingIndex.jsx'));
const FollowedMeetingShow = lazy(() => import('./pages/meetings/followedmeetings/MeetingShow.jsx'));
const FollowedMeetingParticipant = lazy(() => import('./pages/meetings/followedmeetings/participants/MeetingParticipant.jsx'));
const FollowedMeetingDocumentation = lazy(() => import('./pages/meetings/followedmeetings/documentations/MeetingDocumentation.jsx'));

const EventMenu = lazy(() => import('./pages/events/EventMenu.jsx'));
const EventIndex = lazy(() => import('./pages/events/events/EventIndex.jsx'));
const EventParticipant = lazy(() => import('./pages/events/events/participants/EventParticipant.jsx'));
const EventSession = lazy(() => import('./pages/events/events/sessions/EventSession.jsx'));
const EventSessionShow = lazy(() => import('./pages/events/events/sessions/EventSessionShow.jsx'));

const FollowedEventIndex = lazy(() => import('./pages/events/followedevents/EventIndex.jsx'));
const FollowedEventParticipant = lazy(() => import('./pages/events/followedevents/participants/EventParticipant.jsx'));
const FollowedEventSession = lazy(() => import('./pages/events/followedevents/sessions/EventSession.jsx'));

const MyEventIndex = lazy(() => import('./pages/events/myevents/EventIndex.jsx'));
const MyEventParticipant = lazy(() => import('./pages/events/myevents/participants/EventParticipant.jsx'));
const MyEventSession = lazy(() => import('./pages/events/myevents/sessions/EventSession.jsx'));
const MyEventSessionShow = lazy(() => import('./pages/events/myevents/sessions/EventSessionShow.jsx'));

const UserIndex = lazy(() => import('./pages/users/UserIndex.jsx'));
const UserShow = lazy(() => import('./pages/users/UserShow.jsx'));
const UserProfile = lazy(() => import('./pages/users/UserProfile.jsx'));
const UserRole = lazy(() => import('./pages/users/roles/UserRole.jsx'));
const UserUnit = lazy(() => import('./pages/users/units/UserUnit.jsx'));

const MasterMenu = lazy(() => import('./pages/master/MasterMenu.jsx'));
const UnitIndex = lazy(() => import('./pages/master/units/UnitIndex.jsx'));
const UnitShow = lazy(() => import('./pages/master/units/UnitShow.jsx'));
const PositionIndex = lazy(() => import('./pages/master/positions/PositionIndex.jsx'));
const GuestTypeIndex = lazy(() => import('./pages/master/guesttypes/GuestTypeIndex.jsx'));
const PermissionIndex = lazy(() => import('./pages/master/permissions/PermissionIndex.jsx'));
const RoleIndex = lazy(() => import('./pages/master/roles/RoleIndex.jsx'));
const RoleShow = lazy(() => import('./pages/master/roles/RoleShow.jsx'));

const ProfileIndex = lazy(() => import('./pages/profile/ProfileIndex.jsx'));
const ProfileRole = lazy(() => import('./pages/profile/ProfileRole.jsx'));
const ProfileAccount = lazy(() => import('./pages/profile/ProfileAccount.jsx'));

const PrintEvent = lazy(() => import('./pages/events/events/print/PrintEvent.jsx'));
const PrintEventAttendees = lazy(() => import('./pages/events/events/print/PrintEventAttendees.jsx'));

const MyPrintEvent = lazy(() => import('./pages/events/myevents/print/PrintEvent.jsx'));
const MyPrintEventAttendees = lazy(() => import('./pages/events/myevents/print/PrintEventAttendees.jsx'));

const GuestBookMenu = lazy(() => import('./pages/guestbook/GuestBookMenu.jsx'));
const GuestBookIndex = lazy(() => import('./pages/guestbook/admin/GuestBookIndex.jsx'));
const GuestBookShow = lazy(() => import('./pages/guestbook/admin/GuestBookShow.jsx'));
const GuestBookDashboard = lazy(() => import('./pages/guestbook/dashboard/GuestBookDashboard.jsx'));

//PUBLIC
const PublicGuestBookLayout = lazy(() => import('./pages/public/guestbook/GuestBookLayout.jsx'));
const PublicGuestBookIndex = lazy(() => import('./pages/public/guestbook/Index.jsx'));
const PublicGuestBookSuccess = lazy(() => import('./pages/public/guestbook/Success.jsx'));

function App() {
    const { accessToken } = useAuth();

    return (
        <PermissionsProvider userToken={accessToken}>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                pauseOnHover
                theme="colored"
                transition={Zoom}
            />
            <Routes>
                <Route path="/" element={<AuthLayout />}>
                    <Route path="/" element={<Dashboard />}></Route>
                    <Route path="/guest-books" element={<GuestBookLayout />}>
                        <Route path="/guest-books" element={<GuestBookMenu />}></Route>

                        {/*Meeting Admin*/}
                        <Route path="/guest-books/dashboard" element={<GuestBookDashboard />}></Route>
                        <Route path="/guest-books/admin" element={<GuestBookIndex />}></Route>
                        <Route path="/guest-books/admin/:guestId" element={<GuestBookShow />} />
                        {/*End Meeting Admin*/}
                    </Route>

                    <Route path="/meetings" element={<MeetingLayout />}>
                        <Route path="/meetings" element={<MeetingMenu />}></Route>

                        {/*Meeting Admin*/}
                        <Route path="/meetings/admin" element={<MeetingIndex />}></Route>
                        <Route path="/meetings/admin/:meetingId" element={<MeetingShowLayout />}>
                            <Route path="/meetings/admin/:meetingId" element={<MeetingShow />} />
                            <Route path="/meetings/admin/:meetingId/participants" element={<MeetingParticipant />} />
                            <Route path="/meetings/admin/:meetingId/documentations" element={<MeetingDocumentation />} />
                        </Route>
                        {/*End Meeting Admin*/}

                        {/*My Meeting*/}
                        <Route path="/meetings/my-meetings" element={<MyMeetingIndex />}></Route>
                        <Route path="/meetings/my-meetings/:meetingId" element={<MyMeetingShowLayout />}>
                            <Route path="/meetings/my-meetings/:meetingId" element={<MyMeetingShow />} />
                            <Route path="/meetings/my-meetings/:meetingId/participants" element={<MyMeetingParticipant />} />
                            <Route path="/meetings/my-meetings/:meetingId/documentations" element={<MyMeetingDocumentation />} />
                        </Route>
                        {/*End My Meeting*/}

                        {/*Followed Meeting*/}
                        <Route path="/meetings/followed-meetings" element={<FollowedMeetingIndex />}></Route>
                        <Route path="/meetings/followed-meetings/:meetingId" element={<FollowedMeetingShowLayout />}>
                            <Route path="/meetings/followed-meetings/:meetingId" element={<FollowedMeetingShow />} />
                            <Route path="/meetings/followed-meetings/:meetingId/participants" element={<FollowedMeetingParticipant />} />
                            <Route path="/meetings/followed-meetings/:meetingId/documentations" element={<FollowedMeetingDocumentation />} />
                        </Route>
                        {/*End Followed Meeting*/}
                    </Route>

                    <Route path="/events" element={<EventLayout />}>
                        <Route path="/events" element={<EventMenu />}></Route>

                        {/*Event Admin*/}
                        <Route path="/events/admin" element={<EventIndex />}></Route>
                        <Route path="/events/admin/:eventId" element={<EventShowLayout />}>
                            <Route path="/events/admin/:eventId" element={<EventParticipant />} />

                            <Route path="/events/admin/:eventId/sessions" element={<EventSessionLayout />} >
                                <Route path="/events/admin/:eventId/sessions" element={<EventSession />} />
                                <Route path="/events/admin/:eventId/sessions/:sessionId" element={<EventSessionShow />} />
                            </Route>
                        </Route>
                        {/*End Event Admin*/}

                        {/*Event Followed*/}
                        <Route path="/events/followed-events" element={<FollowedEventIndex />}></Route>
                        <Route path="/events/followed-events/:eventId" element={<FollowedEventShowLayout />}>
                            <Route path="/events/followed-events/:eventId" element={<FollowedEventParticipant />} />
                            <Route path="/events/followed-events/:eventId/sessions" element={<FollowedEventSession />} />
                        </Route>
                        {/*End Event Followed*/}

                        {/*MyEvent*/}
                        <Route path="/events/my-events" element={<MyEventIndex />}></Route>
                        <Route path="/events/my-events/:eventId" element={<MyEventShowLayout />}>
                            <Route path="/events/my-events/:eventId" element={<MyEventParticipant />} />

                            <Route path="/events/my-events/:eventId/sessions" element={<MyEventSessionLayout />} >
                                <Route path="/events/my-events/:eventId/sessions" element={<MyEventSession />} />
                                <Route path="/events/my-events/:eventId/sessions/:sessionId" element={<MyEventSessionShow />} />
                            </Route>
                        </Route>
                        {/*End MyEvent*/}
                    </Route>

                    <Route path="/master" element={<MasterLayout />}>
                        <Route path="/master" element={<MasterMenu />}></Route>

                        <Route path="/master/units" element={<UnitIndex />}></Route>
                        <Route path="/master/units/:unitId" element={<UnitShow />}></Route>

                        <Route path="/master/positions" element={<PositionIndex />}></Route>

                        <Route path="/master/guest-types" element={<GuestTypeIndex />}></Route>

                        <Route path="/master/permissions" element={<PermissionIndex />}></Route>
                        <Route path="/master/roles" element={<RoleIndex />}></Route>
                        <Route path="/master/roles/:roleId" element={<RoleShow />}></Route>
                    </Route>

                    <Route path="/users" element={<UserLayout />}>
                        <Route path="/users" element={<UserIndex />}></Route>
                        <Route path="/users/:userId" element={<UserShowLayout />}>
                            <Route path="/users/:userId" element={<UserShow />} />
                            <Route path="/users/:userId/profile" element={<UserProfile />} />
                            <Route path="/users/:userId/roles" element={<UserRole />} />
                            <Route path="/users/:userId/units" element={<UserUnit />} />
                        </Route>
                    </Route>

                    <Route path="/profile" element={<ProfileLayout />}>
                        <Route path="/profile" element={<ProfileAccount />} />
                        <Route path="/profile/show" element={<ProfileIndex />} />
                        <Route path="/profile/roles" element={<ProfileRole />} />
                    </Route>
                </Route>

                <Route element={<PrintLayout />}>
                    {/*  Print Admin */}
                    <Route path="/events/admin/:eventId/print" element={<PrintEvent />} />
                    <Route path="/events/admin/:eventId/print/attendees" element={<PrintEventAttendees />} />
                    {/*  End Print Admin */}

                    {/* My Print Event */}
                    <Route path="/events/my-events/:eventId/print" element={<MyPrintEvent />} />
                    <Route path="/events/my-events/:eventId/print/attendees" element={<MyPrintEventAttendees />} />
                    {/*  End My Print Event */}
                </Route>

                <Route element={<GuestLayout />}>
                    <Route path="/auth/login" element={<Login />}></Route>
                    <Route path="/auth/login-sso" element={<LoginSso />} />

                    <Route element={<PublicGuestBookLayout />}>
                        <Route path="/common/guest-books/form" element={<PublicGuestBookIndex />}></Route>
                        <Route path="/common/guest-books/success" element={<PublicGuestBookSuccess />}></Route>
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </PermissionsProvider>
    );
}

export default App;
