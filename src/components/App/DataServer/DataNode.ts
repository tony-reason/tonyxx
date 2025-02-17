import { defaultThumb } from 'utils/config';
export { DataNode };

class DataNode {
    id: Id;
    data: DataNode.Data;
    meta: DataNode.Meta = {};
    links: DataNode.Links = {};

    constructor({ id, type, remote, name, thumb = defaultThumb(type), content }: DataRecord) {
        this.id = id;
        this.data = { name, thumb, content };
        this.meta = { type, remote };
    }

    modify(newData: DataNode.Data) {
        Object.assign(this.data, newData);
        return this;
    }
}
