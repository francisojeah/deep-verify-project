"""Benchmark dataset definitions.

Every entry records what the data actually is, not what its Hugging Face repo
claims. `thenewsupercell/with_id_celeb-df-image-dataset` is named for Celeb-DF
but its filenames (`00001_id00220_wavtolip.mp4`) are VoxCeleb2 speaker ids with
Wav2Lip manipulations, which is FakeAVCeleb. It is recorded here as such.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class DatasetSpec:
    key: str
    repo: str
    display_name: str
    splits: tuple[str, ...]
    fake_label: str
    provenance: str
    manipulation_family: str
    group_column: str | None = None
    """Column identifying the source video, for video-level aggregation."""

    pre_cropped: bool = True
    streaming: bool = False


SPECS: dict[str, DatasetSpec] = {
    "fakeavceleb": DatasetSpec(
        key="fakeavceleb",
        repo="thenewsupercell/with_id_celeb-df-image-dataset",
        display_name="FakeAVCeleb (community mirror)",
        splits=("train", "validation", "test"),
        fake_label="Fake",
        provenance=(
            "Community re-upload listed on the Hub as Celeb-DF. Filenames such as "
            "00001_id00220_wavtolip.mp4 are VoxCeleb2 speaker ids with Wav2Lip "
            "manipulations, which identifies it as FakeAVCeleb, not Celeb-DF. "
            "Not verified against the official FakeAVCeleb release."
        ),
        manipulation_family="lip-sync (Wav2Lip) and face-swap, on VoxCeleb2 sources",
        group_column="original_file_name",
    ),
    "hemg-mixed": DatasetSpec(
        key="hemg-mixed",
        repo="Hemg/deepfake-and-real-images",
        display_name="Hemg/deepfake-and-real-images",
        splits=("train",),
        fake_label="Fake",
        provenance=(
            "Community upload with no dataset card and no source attribution. "
            "Carries no filenames, so its origin cannot be verified from the data. "
            "Reported under its repo id rather than a benchmark name."
        ),
        manipulation_family="unknown",
        streaming=True,
    ),
}


def all_splits_are_held_out(spec: DatasetSpec) -> str:
    """Why train/validation/test labels carry no meaning for these runs."""
    return (
        f"The detector was trained on FaceForensics++ by its authors and has never "
        f"seen {spec.display_name}. Every split is therefore held out, and samples "
        f"are drawn across all of them to reach a balanced set."
    )
