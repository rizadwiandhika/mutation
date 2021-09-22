import { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'
import PassengerInput from './PassengerInput'
import ListPassenger from './ListPassenger'
import Header from './Header'
import Edit from './Edit'

import withGraphQL from '../hoc/withGraphQL'

class Home extends Component {
  state = {
    data: [],
    input: '',
    showEditing: false,
    edit: {
      id: '',
      nama: '',
      umur: '',
      jenisKelamin: 'Pria'
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO: harusnya object deep equality
    if (prevProps.anggota.data) return

    this.setState((state) => {
      const anggotaFetched = this.props.anggota.data.anggota.map((a) => ({
        ...a,
        jenisKelamin: a.jenis_kelamin
      }))
      return { data: [...state.data, ...anggotaFetched] }
    })
  }

  hapusPengunjung = async (id) => {
    console.log(id)
    try {
      await this.props.deleteAnggotaById({ variables: { id } })
      this.setState({
        data: [
          ...this.state.data.filter((item) => {
            return item.id !== id
          })
        ]
      })
    } catch (error) {
      console.error(error)
    }
  }

  tambahPengunjung = async (newUser) => {
    const { nama, umur, jenisKelamin: jenis_kelamin } = newUser
    const newData = { nama, umur, jenis_kelamin }
    try {
      await this.props.insertOneAnggota({ variables: { data: newData } })
      const result = this.props.insertOneResult.data.insert_anggota_one
      const user = { ...result, jenisKelamin: result.jenis_kelamin }

      this.setState({
        data: [...this.state.data, user]
      })
    } catch (error) {
      console.error(error)
    }
  }

  openEdit = (id) => {
    if (id === this.state.edit.id) return

    const [selectedPengunjung] = this.state.data.filter((v) => v.id === id)
    this.setState({
      showEditing: true,
      edit: { ...selectedPengunjung }
    })
  }

  onChangeEdit = (e) => {
    const { name, value } = e.target
    this.setState((state, props) => {
      return { edit: { ...state.edit, [name]: value } }
    })
  }

  editPengunjung = async (e) => {
    e.preventDefault()
    const { id, jenisKelamin: jenis_kelamin, nama, umur } = this.state.edit

    try {
      await this.props.updateAnggotaById({
        variables: { id, jenis_kelamin, nama, umur }
      })

      const result = this.props.updateAnggota.data.update_anggota_by_pk
      const user = { ...result, jenisKelamin: result.jenis_kelamin }

      this.setState((state, props) => {
        const updatedUser = state.data.map((p) => {
          return p.id === user.id ? user : p
        })

        return { data: updatedUser, showEditing: false }
      })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return (
      <>
        {this.props.anggota.loading ? (
          <h1>Fetching data...</h1>
        ) : (
          <div>
            <Header />
            <ListPassenger
              openEdit={this.openEdit}
              data={this.state.data}
              hapusPengunjung={this.hapusPengunjung}
            />
            {this.props.insertOneResult.loading ? (
              <h3>insert loading...</h3>
            ) : (
              <PassengerInput tambahPengunjung={this.tambahPengunjung} />
            )}
          </div>
        )}

        {this.state.showEditing && (
          <>
            <br />
            <br />
            <Edit
              {...this.state.edit}
              onSubmit={this.editPengunjung}
              onChangeInput={this.onChangeEdit}
            />
          </>
        )}

        <br />
        <br />

        <input
          value={this.state.input}
          onChange={(e) => this.setState({ input: e.target.value })}
          type="text"
        />
        <button
          onClick={() => this.props.lazy.getAnggotaById(this.state.input)}
        >
          Cari
        </button>

        {this.props.lazy.loading && <h1>Fetching user's data id...</h1>}
        {this.props.lazy.error && <h1>Error fetching user's data :(</h1>}
        {this.props.lazy.data && (
          <>
            <h1>{this.props.lazy.data?.anggota_by_pk.id}</h1>
            <h1>{this.props.lazy.data?.anggota_by_pk.nama}</h1>
            <h1>{this.props.lazy.data?.anggota_by_pk.umur}</h1>
          </>
        )}
      </>
    )
  }
}

export default withGraphQL(Home)
