import React from 'react'

import { useLazyQuery, useQuery, useMutation } from '@apollo/client'
import {
  GET_ANGGOTA,
  GET_ANGGOTA_BY_ID,
  INSERT_ONE_ANGGOTA,
  DELETE_ANGGOTA_BY_ID
} from '../api/hasura-graphql'

export default function withGraphQL(Component) {
  return function (props) {
    const anggota = useQuery(GET_ANGGOTA)
    const [lazyGetData, lazy] = useLazyQuery(GET_ANGGOTA_BY_ID)
    const [insertOneAnggota, insertOneResult] = useMutation(INSERT_ONE_ANGGOTA)
    const [deleteAnggotaById, deleteAnggota] = useMutation(DELETE_ANGGOTA_BY_ID)

    return (
      <Component
        lazy={{
          getAnggotaById: (id) => lazyGetData({ variables: { id } }),
          ...lazy
        }}
        anggota={anggota}
        insertOneAnggota={insertOneAnggota}
        insertOneResult={insertOneResult}
        deleteAnggotaById={deleteAnggotaById}
        deleteAnggota={deleteAnggota}
        {...props}
      />
    )
  }
}
