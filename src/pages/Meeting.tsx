import React, { useEffect, useState, useCallback } from 'react'
import { MeetingType } from '../utils/Types'
import { getDocs, query, where } from 'firebase/firestore'
import { meetingsRef } from '../utils/FirebaseConfig'
import { useAppSelector } from '../app/hooks'
import useAuth from '../hooks/useAuth'
import Header from '../components/Header'
import { EuiBadge, EuiBasicTable, EuiButtonIcon, EuiCopy, EuiFlexGroup, EuiFlexItem, EuiPanel } from '@elastic/eui'
import { Link } from 'react-router-dom'
import moment from "moment"


function Meeting() {
    useAuth();
    const userInfo = useAppSelector((zoom) => zoom.auth.userInfo);
    const [meetings, setMeetings] = useState<Array<MeetingType>>([]);
    const [showEditFlyout, setShowEditFlyout] = useState(false);
    const [editMeeting, setEditMeeting] = useState<MeetingType>();
    useEffect(() => {
        const getMyMeetings = async () => {
            const firestoreQuery = query(meetingsRef);
            const fetchedMeetings = await getDocs(firestoreQuery);
            if (fetchedMeetings.docs.length) {
                const myMeetings: Array<MeetingType> = [];
                fetchedMeetings.forEach((meeting) => {
                    const data = meeting.data() as MeetingType;
                    if (data.createdBy === userInfo?.uid)
                        myMeetings.push(meeting.data() as MeetingType);
                    else if (data.meetingType === "anyone-can-join")
                        myMeetings.push(meeting.data() as MeetingType);
                    else {
                        const index = data.invitedUsers.findIndex(
                            (user: string) => user === userInfo?.uid
                        );
                        if (index !== -1) {
                            myMeetings.push(meeting.data() as MeetingType);
                        }
                    }
                });

                setMeetings(myMeetings);
            }
        };
        if (userInfo) getMyMeetings();
    }, [userInfo]);

    const columns = [
        {
            field: "meetingName",
            name: "Meeting Name",
        },
        {
            field: "meetingType",
            name: "Meeting Type"
        },
        {
            field: "meetingDate",
            name: "Meeting Date"
        },
        {
            field: "",
            name: "Edit",
            render: (meeting: MeetingType) => {
                return (
                    <EuiButtonIcon
                        aria-label='meeting-edit'
                        iconType="indexEdit"
                        color='danger'
                        display='base'
                        isDisabled={
                            !meeting.status || moment(meeting.meetingDate).isBefore(moment().format("L"))
                        }
                    />
                )
            }
        },
        {
            field: "meetingId",
            name: "Copy Link",
            render: (meetingId: string) => {
                return <EuiCopy textToCopy={`localhost:3000/join/${meetingId}`}>
                    {(copy: any) =>
                        <EuiButtonIcon
                            iconType="copy"
                            onClick={copy}
                            display='base'
                            aria-label='Meeting-copy'
                        />
                    }
                </EuiCopy>
            }
        }

    ]

    return (

        <div
            style={{
                display: "flex",
                height: "100vh",
                flexDirection: "column"
            }}
        >
            <Header />
            <EuiFlexGroup justifyContent='center' style={{ margin: "1rem" }}>
                <EuiFlexItem>
                    <EuiPanel>
                        <EuiBasicTable
                            items={meetings}
                            columns={columns}
                        />
                    </EuiPanel>
                </EuiFlexItem>
            </EuiFlexGroup>
        </div>
    )
}

export default Meeting