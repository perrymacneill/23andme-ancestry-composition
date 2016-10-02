import { connect } from 'react-redux';
import AncestryChart from '../components/AncestryChart';

const mapStateToProps = (state) => {
  return {
    ancestryData: state
  }
};

const AncestryContainer = connect(
  mapStateToProps
)(AncestryChart);

export default AncestryContainer;
