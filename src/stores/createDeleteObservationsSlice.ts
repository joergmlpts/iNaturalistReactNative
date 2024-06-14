const DEFAULT_STATE = {
  currentDeleteCount: 1,
  deletions: [],
  deletionsComplete: false,
  deletionsCompletedAt: null,
  deletionsInProgress: false,
  deleteError: null
};

interface DeleteObservationsSlice {
  currentDeleteCount: number,
  deletions: Array<Object>,
  deletionsComplete: boolean,
  deletionsCompletedAt: Date,
  deletionsInProgress: boolean,
  deleteError: string | null
}

const createDeleteObservationsSlice: StateCreator<DeleteObservationsSlice> = set => ( {
  ...DEFAULT_STATE,
  setDeletions: deletions => set( ( ) => ( { deletions } ) ),
  startNextDeletion: ( ) => set( state => ( {
    currentDeleteCount: state.currentDeleteCount + 1,
    deletionsInProgress: true
  } ) ),
  finishDeletions: ( ) => set( ( ) => ( {
    deletionsInProgress: false,
    deletionsComplete: true,
    deletionsCompletedAt: new Date( )
  } ) ),
  resetDeleteObservationsSlice: ( ) => set( DEFAULT_STATE ),
  setDeletionError: message => set( ( ) => ( {
    deleteError: message
  } ) )
} );

export default createDeleteObservationsSlice;