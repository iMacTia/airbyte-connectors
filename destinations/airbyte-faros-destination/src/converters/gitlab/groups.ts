import {AirbyteRecord} from 'faros-airbyte-cdk';
import {Utils} from 'faros-feeds-sdk';

import {GitlabCommon, GitlabConverter} from '../common/gitlab';
import {DestinationModel, DestinationRecord, StreamContext} from '../converter';

export class Groups extends GitlabConverter {
  readonly destinationModels: ReadonlyArray<DestinationModel> = [
    'cicd_Organization',
    'vcs_Organization',
  ];

  async convert(
    record: AirbyteRecord,
    ctx: StreamContext
  ): Promise<ReadonlyArray<DestinationRecord>> {
    const source = this.streamName.source;
    const group = record.record.data;
    const res: DestinationRecord[] = [];

    res.push({
      model: 'cicd_Organization',
      record: {
        uid: group.path,
        description: group.description?.substring(
          0,
          GitlabCommon.MAX_DESCRIPTION_LENGTH
        ),
        name: group.name,
        url: group.web_url,
        source,
      },
    });

    res.push({
      model: 'vcs_Organization',
      record: {
        uid: group.path,
        name: group.name,
        htmlUrl: group.web_url,
        type: {category: 'Group', detail: ''},
        createdAt: Utils.toDate(group.created_at),
        source,
      },
    });

    return res;
  }
}
