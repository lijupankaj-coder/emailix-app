import { useEmailStore } from '../../store/useEmailStore';
import LogoBlock from './LogoBlock';
import TitleBlock from './TitleBlock';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import ButtonBlock from './ButtonBlock';
import DividerBlock from './DividerBlock';
import SpacerBlock from './SpacerBlock';
import SocialBlock from './SocialBlock';
import VideoBlock from './VideoBlock';
import ColumnsBlock from './ColumnsBlock';

const COMPONENTS = {
  logo: LogoBlock,
  title: TitleBlock,
  text: TextBlock,
  image: ImageBlock,
  button: ButtonBlock,
  divider: DividerBlock,
  spacer: SpacerBlock,
  social: SocialBlock,
  video: VideoBlock,
  columns: ColumnsBlock,
};

export default function BlockRenderer({ block }) {
  const { globalSettings } = useEmailStore();
  const Component = COMPONENTS[block.type];
  if (!Component) return null;
  return <Component props={block.props} globalSettings={globalSettings} blockId={block.id} />;
}
