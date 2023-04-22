import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PHOTO_FRAGMENT } from "../components/fragments.js";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { FatText } from "../components/shared.js";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Auth/Button.js";
import PageTitle from "../components/PageTitle.js";
import useUser from "../hooks/useUser.js";
import Post from "./Post.js";
import ShowFollowers, { SEE_FOLLOWERS_QUERY } from "./ShowFollowers.js";
import ShowFollowing, { SEE_FOLLOWING_QUERY } from "./ShowFollowing.js";
import { isLoggedInVar } from "../apollo.js";
import { RotatingLines } from "react-loader-spinner";

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($id: Int!) {
    followUser(id: $id) {
      ok
      id
    }
  }
`;

const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
      id
    }
  }
`;

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      id
      firstName
      lastName
      username
      bio
      avatar
      email
      photos {
        ...PhotoFragment
      }
      totalFollowing
      totalFollowers
      isMe
      isFollowing
    }
  }
  ${PHOTO_FRAGMENT}
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const Avatar = styled.img`
  margin-left: 50px;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-right: 150px;
  background-color: lightgray;
  outline: 2px solid ${props=>props.theme.accent};
  outline-offset: 5px;
`;

const Column = styled.div``;
const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;

const Row = styled.div`
  margin-bottom: 20px;
  gap: 3px;
  font-size: 16px;
  display: flex;
  align-items: center;
`;
const List = styled.ul`
  display: flex;
`;

const Item = styled.li`
  margin-right: 20px;
`;
const Value = styled(FatText)`
  font-size: 18px;
  cursor: pointer;
`;
const Name = styled(FatText)`
  font-size: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
`;
const Photo = styled.div`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
`;
const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;

const ProfileButton = styled(Button).attrs({
  as: "span",
})`
  margin-top: 0;
  margin-left: 15px;
  cursor: pointer;
  padding: 10px 20px;
`;

const LoadContainer=styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function Profile() {
  const location = useLocation();
  const notify = () => toast.success("Successfully edited profile..!!");

  const [showModal, setShowModal] = useState(false);
  const [showfollower, setShowFollower] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const closeModal = () => {
    return setShowModal(false);
  };

  const closeFollower = () => {
    return setShowFollower(false);
  };

  const closeFollowing = () => {
    return setShowFollowing(false);
  };

  const { username } = useParams();
  const client = useApolloClient();
  const { data: userData } = useUser();
  const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username,
    },
  });

  useEffect(() => {
    if (location?.state?.message === "ok") {
      notify();
    }
    return () => {
      location.state = "";
    };
  }, []);

  const unfollowUserUpdate = (cache, result) => {
    const {
      data: {
        unfollowUser: { ok, id },
      },
    } = result;
    if (!ok) {
      return;
    }

    cache.modify({
      id: `User${username}`,
      fields: {
        isFollowing() {
          return false;
        },
        totalFollowers(prev) {
          return prev - 1;
        },
      },
    });

    cache.evict({
      followerid: `Follower:${id}`,
      fields: {
        userId: userData.id,
      },
    });

    const { me } = userData;
    cache.modify({
      id: `User:${me.username}`,
      fields: {
        totalFollowing(prev) {
          return prev - 1;
        },
      },
    });
  };

  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    update: unfollowUserUpdate,
  });

  const followUserCompleted = (data) => {
    const {
      followUser: { ok, id },
    } = data;
    if (!ok) {
      return;
    }
    const { cache } = client;

    cache.modify({
      id: `User:${username}`,
      fields: {
        isFollowing(prev) {
          return true;
        },
        totalFollowers(prev) {
          return prev + 1;
        },
      },
    });

    const { me } = userData;
    cache.modify({
      id: `User:${me.username}`,
      fields: {
        totalFollowing(prev) {
          return prev + 1;
        },
      },
    });
  };

  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    onCompleted: followUserCompleted,
    refetchQueries: [
      {
        query: SEE_FOLLOWERS_QUERY,
        variables: {
          username,
        },
      },
      {
        query: SEE_FOLLOWING_QUERY,
        variables: {
          username,
        },
      },
    ],
  });

  const getButton = (value) => {
    const { isMe, isFollowing } = value;
    if (isMe) {
      return (
        <div>
          <ProfileButton>
            <Link to={`/users/edit/${username}`}>Edit</Link>
          </ProfileButton>
          <ProfileButton onClick={() => setShowModal(true)}>Post</ProfileButton>
        </div>
      );
    }
    if (isFollowing) {
      return (
        <ProfileButton
          onClick={() => unfollowUser({ variables: { username } })}
        >
          Unfollow
        </ProfileButton>
      );
    } else {
      return (
        <ProfileButton
          onClick={() =>
            followUser({
              variables: {
                id: data?.seeProfile?.id,
              },
            })
          }
        >
          Follow
        </ProfileButton>
      );
    }
  };

  return (
    <>
      {loading ? (
        <LoadContainer>
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="50"
            visible={true}
          />
        </LoadContainer>
      ) : (
        <div>
          {showModal ? <Post close={closeModal} /> : null}
          {showfollower ? (
            <ShowFollowers
              close={closeFollower}
              name={username}
              isMe={data?.seeProfile?.isMe}
              userId={data?.seeProfile?.id}
              isFollowing={data?.seeProfile?.isFollowing}
            />
          ) : null}
          {showFollowing ? (
            <ShowFollowing
              close={closeFollowing}
              name={username}
              isMe={data?.seeProfile?.isMe}
              isFollowing={data?.seeProfile?.isFollowing}
              userId={data?.seeProfile?.id}
            />
          ) : null}
          <PageTitle
            title={
              loading
                ? "Loading..."
                : `${data?.seeProfile?.username}'s Profile'`
            }
          />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            pauseOnHover
            theme="colored"
          />
          <Header>
            <Avatar src={data?.seeProfile?.avatar} />
            <Column>
              <Row>
                <Username>{data?.seeProfile?.username}</Username>
                {data?.seeProfile ? getButton(data?.seeProfile) : null}
              </Row>
              <Row>
                <List>
                  <Item>
                    <span>
                      <Value
                        onClick={() => setShowFollower(true)}
                      >{`${data?.seeProfile?.totalFollowers} followers`}</Value>
                    </span>
                  </Item>

                  <Item>
                    <span>
                      <Value
                        onClick={() => setShowFollowing(true)}
                      >{`${data?.seeProfile?.totalFollowing} following`}</Value>
                    </span>
                  </Item>
                </List>
              </Row>
              <Row>
                <Name>
                  {data?.seeProfile?.firstName} {data?.seeProfile?.lastName}
                </Name>
              </Row>
              <Row>{data?.seeProfile?.bio}</Row>
            </Column>
          </Header>
          <Grid>
            {data?.seeProfile?.photos.map((photo) => (
              <Photo bg={photo.file} key={photo.id}>
                <Icons>
                  <Icon>
                    <FontAwesomeIcon icon={faHeart} />
                    {photo.likes}
                  </Icon>
                  <Icon>
                    <FontAwesomeIcon icon={faComment} />
                    {photo.commentNumber}
                  </Icon>
                </Icons>
              </Photo>
            ))}
          </Grid>
        </div>
      )}
    </>
  );
}
