using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    static public UIManager instance;

    [Header("◆ Instances")]
    [SerializeField]
    private GameObject selectHighlighter = null;
    [SerializeField]
    private GameObject attackHighlighter = null;
    [SerializeField]
    private Text battleshipCountText = null;
    [SerializeField]
    private Text cruiserCountText = null;
    [SerializeField]
    private Text destroyerCountText = null;

    void Awake()
    {
        if (instance == null) instance = this;
        else Destroy(gameObject);
    }
    
    public void UpdatePlacementPhase()
    {
        // TODO: Text 필드 전부 지우고 transform.GetComponentInChildren<Text>()으로 찾아서 소프트코딩
        battleshipCountText.text = MapManager.instance.ShipCounts[0].ToString();
        cruiserCountText.text = MapManager.instance.ShipCounts[1].ToString();
        destroyerCountText.text = MapManager.instance.ShipCounts[2].ToString();
    }
    
    public void SelectHighlight(Hex hex)
    {
        UnhighlightAll();
        selectHighlighter.SetActive(true);
        selectHighlighter.transform.position = Hex.HexToSqr(hex);
    }
    public void AttackHighlight(Hex hex)
    {
        UnhighlightAll();
        attackHighlighter.SetActive(true);
        attackHighlighter.transform.position = Hex.HexToSqr(hex);
    }
    public void SelectUnhighlight()
    {
        selectHighlighter.SetActive(false);
    }
    public void AttackUnhighlight()
    {
        attackHighlighter.SetActive(false);
    }
    public void UnhighlightAll()
    {
        SelectUnhighlight();
        AttackUnhighlight();
    }
}
