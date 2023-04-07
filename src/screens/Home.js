import React from "react";
import { logUserOut } from "../apollo.js";
import { gql, useQuery } from "@apollo/client";
import Photo from "../components/Feed/Photo.js";
import PageTitle from "../components/PageTitle.js";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../components/fragments.js";

const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      ...PhotoFragment
      user {
        username
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
      createAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

export default function Home() {
  const { data } = useQuery(FEED_QUERY);
  return (
    <div>
      <PageTitle title={"Home"} />
      {data?.seeFeed?.map((photo) => (
        <Photo key={photo.id} {...photo} />
      ))}
    </div>
  );
}
