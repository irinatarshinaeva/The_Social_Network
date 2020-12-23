import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#B0E0E6',
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
    width: '100vw',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    // background: 'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)'
    backgroundColor: '#e0ffff	',
  },
  first: {
    height: '100vh',
    justyfy: 'space-around',
    alignItems: 'stretch',
  },

  grid: {
    // height: '100vh',
    alignItems: 'center',
  },
  
}));

export default useStyles
