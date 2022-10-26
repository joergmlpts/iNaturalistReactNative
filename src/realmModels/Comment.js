import { Realm } from "@realm/react";
import inatjs from "inaturalistjs";

import User from "./User";

class Comment extends Realm.Object {
  static COMMENT_FIELDS = {
    uuid: true,
    body: true,
    created_at: true,
    id: true,
    user: User && User.USER_FIELDS
  };

  static mapApiToRealm( comment, realm ) {
    return {
      ...comment,
      user: User.mapApiToRealm( comment.user, realm )
    };
  }

  static async deleteComment( id, realm, apiToken ) {
    // first delete locally
    realm?.write( ( ) => {
      const commentToDelete = realm.objects( "Comment" ).filtered( `uuid == "${id}"` )[0];
      realm.delete( commentToDelete );
    } );

    // then delete remotely
    const options = { api_token: apiToken };
    try {
      await inatjs.comments.delete( { id }, options );
    } catch ( e ) {
      console.log( JSON.stringify( e ), "couldn't delete comment" );
    }
  }

  static schema = {
    name: "Comment",
    properties: {
      uuid: "string",
      body: "string?",
      created_at: { type: "string?", mapTo: "createdAt" },
      id: "int?",
      user: "User?",
      // this creates an inverse relationship so comments
      // automatically keep track of which Observation they are assigned to
      assignee: {
        type: "linkingObjects",
        objectType: "Observation",
        property: "comments"
      }
    }
  }
}

export default Comment;