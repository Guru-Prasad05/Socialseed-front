import React, { useEffect } from "react";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { isLoggedInVar, logUserOut } from "../apollo";

const ME_QUERY = gql`
  query me {
    me {
      id
      username
      avatar
    }
  }
`;

export default function useUser() {
  const hasToken = useReactiveVar(isLoggedInVar);
  const { data } = useQuery(ME_QUERY, {
    skip: !hasToken,
  });
  useEffect(()=>{
    if(data?.me===null){
        logUserOut()
    }
  },[data])
  return {data}
}
